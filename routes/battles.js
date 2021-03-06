var router = require('express').Router(),
	mongoose = require('mongoose'),
	Battles = mongoose.model('Battles'),
	formidable = require('formidable'),
	imgur = require('imgur'),
	fs = require('fs'),
	socketServer;

function addImage(path, entery, callback){
	imgur.uploadFile(path)
    	.then(function (json) {
    		entery.image = json.data.link;
    		fs.unlink(path);
    		callback(null, entery);
    	})
		.catch(function (err) {
			callback(err);
			fs.unlink(path);
		});
}

function saveBattle(battle, res){
	console.log('save battle');
	Battles.findOne()
    	.where({id: {'$ne':null}})
	    .sort('-id')
	    .exec(function(err, doc)
	    {
	    	doc = doc || {id:-1};
	        battle.id = (Number(doc.id) + 1);
	        battle.save(function(err, result){
					if(!err){
						res.writeHead(201, {'content-type': 'application/json; charset=utf-8'});
						res.write(JSON.stringify(battle));
						updateSocket();
					}else{
						res.writeHead(400, {'content-type': 'application/json; charset=utf-8'});
						console.log(err);
					}
					res.end();
				});
	    });
}

router
	.get('/',function(req, res){
		var pagesize = Number(req.query.pagesize);
		var page = Number(req.query.page);
		if(page > 0 && pagesize > 0){
			page = (page - 1) * pagesize;
			Battles.find({}, {}, {limit:pagesize, skip:page}, function(err, data){
				data = data || [];
				res.send(data);
			});
		}else{
			Battles.find(function(err, data){
				data = data || [];
				res.send(data);
			});
		}
	});
	router.post('/', function(req, res){
		if(req.session.google){
			var form = new formidable.IncomingForm();
	    	form.parse(req, function(err, fields, files) {
	    		if(err){
	    			res.writeHead(500, {'content-type': 'application/json; charset=utf-8'});
	    			res.end();
	    		}else{
	 				var battle = new Battles();
	 				battle.name = fields.name;
	 				battle.owner = req.session.google;
	 				var enteries = [];
	 				var filesLength = 0;
	 				for(var filekey in files){
	 					filesLength++;
	 					var entery = {
	 						title: fields[filekey+'_title'],
	 						description: fields[filekey+'_description'],
	 						id: filesLength
	 					};
	 					if(files[filekey].path){
	 						addImage(files[filekey].path, entery, function(err, entery){
	 							enteries.push(entery);
	 							if(enteries.length === filesLength && filesLength > 1){
	 								battle.enteries = enteries;
	 								saveBattle(battle, res);
	 							}
	 						});
	 					}
	 				}
	 				if(filesLength < 2){
	 					res.writeHead(400, {'content-type': 'application/json; charset=utf-8'});
	 					res.end();
	 				} 				
	    		}
		      
		    });
	    }else{
	    	res.writeHead(403, {'content-type': 'application/json; charset=utf-8'});
			res.end();
	    }
	});
	router.get('/:id', function(req, res){
		Battles.findOne({id:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}else{
				if(req.query.sortby && req.query.sortby === 'points'){
					data.enteries.sort(function(a, b){return b.points||0-a.points||0});
				}
				res.send(data);
			}
		});
	});
	router.get('/:id/enteries', function(req, res){
		Battles.findOne({id:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(204, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}else{
				data.enteries.sort(function(a, b){return b.points||0-a.points||0});
				res.send(data.enteries);
			}
		});
	});
	router.delete('/:id', function(req, res){
		Battles.findOne({id:req.params.id}, function(err, data){
			if(data.owner === req.session.google){
				Battles.findOne({id:req.params.id}).remove().exec(function(err){
					if(err){
						res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
						res.end();
					}else{
						res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
						res.end();
						updateSocket();
					}
				});
			}else{
				res.writeHead(403, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}
		})
	});
	router.put('/:id', function(req, res){
		Battles.findOne({id:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}else{
				if(req.session.google === data.owner){
					data.name = req.body.name;
					data.save(function(err){
						if(err){
							res.writeHead(400, {'content-type': 'application/json; charset=utf-8'});
							res.end();
						}else{
							res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
							res.write(JSON.stringify(data));
							res.end();
							updateSocket();
						}
					})
				}else{
					res.writeHead(403, {'content-type': 'application/json; charset=utf-8'});
					res.end();
				}
			}
		})
	});
	router.get('/:id/enteries', function(req, res){
		var pagesize = Number(req.query.pagesize);
		var page = Number(req.query.page);
		Battles.findOne({id:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}else{
				if(req.query.sortby && req.query.sortby === 'points'){
					data.enteries.sort(function(a, b){return b.points||0-a.points||0});
				}
				if(page > 0 && pagesize > 0){
					res.send(data.enteries.slice(((page-1) * pagesize), (page * pagesize)));

				}else{
					res.send(data.enteries);
				}
			}
		});
	});

	function updateSocket(){
		Battles.find(function(err, data){
			if(data){
				socketServer.emit('battles', data);
			}
		});
	}

	var setSocketServer = function(socketserver){
		socketServer = socketserver;
	};

module.exports = {
	router : router,
	setSocketServer : setSocketServer
};
