var router = require('express').Router(),
	mongoose = require('mongoose'),
	Battles = mongoose.model('Battles'),
	formidable = require('formidable'),
	imgur = require('imgur');

function addImage(path, entery, callback){
	imgur.uploadFile(path)
    	.then(function (json) {
    		entery.image = json.data.link;
    		callback(null, entery);
    	})
		.catch(function (err) {
			callback(err);
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
		Battles.find(function(err, data){
			data = data || [];
			res.send(data);
		});
	});
	router.post('/', function(req, res){
		var form = new formidable.IncomingForm();
    	form.parse(req, function(err, fields, files) {
    		if(err){
    			res.writeHead(500, {'content-type': 'application/json; charset=utf-8'});
    			res.end();
    		}else{
 				var battle = new Battles();
 				battle.name = fields.name;
 				var enteries = [];
 				var filesLength = 0;
 				for(var filekey in files){
 					filesLength++;
 					var entery = {
 						title: fields[filekey+'_title'],
 						description: fields[filekey+'_description'],
 					};
 					if(files[filekey].path){
 						addImage(files[filekey].path, entery, function(err, entery){
 							enteries.push(entery);
 							console.log(enteries.length + '--' + filesLength);
 							if(enteries.length === filesLength){
 								battle.enteries = enteries;
 								saveBattle(battle, res);
 							}
 						});
 					}
 				} 				
    		}
	      
	    });
	});
	router.get('/:id', function(req, res){
		console.log(req.params);
		Battles.findOne({id:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(204, {'content-type': 'text/plain'});
				res.end();
			}else{
				res.send(data);
			}
		});
	});
module.exports = router;