var router = require('express').Router(),
	mongoose = require('mongoose'),
	Rankings = mongoose.model('Rankings'),
	Battles = mongoose.model('Battles');

	router.get('/', function(req, res){
		var pagesize = Number(req.query.pagesize);
		var page = Number(req.query.page);
		if(page > 0 && pagesize > 0){
			page = (page - 1) * pagesize;
			Rankings.find({}, {}, {limit:pagesize, skip:page}, function(err, data){
				data = data || [];
				res.send(data);
			});
		}else{
			Rankings.find(function(err, data){
				data = data || [];
				res.send(data);
			});
		}
	});

	router.get('/:id', function(req, res){
		Rankings.find({battleid:req.params.id}, function(err, data){
			if(!data){
				res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
				res.end();
			}else{
				res.send(data);
			}
		});
	});


	router.post('/:id', function(req, res){
		var first = req.body.first;
		var second = req.body.second;
		var third = req.body.third;
		var battle = req.params.id;
		var user = req.body.id;
		if(first != second && second != third && first != third){
			Rankings.findOne({battleid:battle, userid:user}, function(err, rating){
				Battles.findOne({id:battle}, function(err, b){
					if(b){
						for(var i = 0; i < b.enteries.length ; i++){
							if(rating && b.enteries[i].id === rating.rating.first){
								console.log('-1 - '+ b.enteries[i].id);
								console.log('before : ' + b.enteries[i].points);
								b.enteries[i].points = (Number(b.enteries[i].points)||3) - 3;
								console.log('after : ' + b.enteries[i].points);
							} else if(rating && b.enteries[i].id === rating.rating.second){
								console.log('-2 - '+ b.enteries[i].id);
								b.enteries[i].points = (Number(b.enteries[i].points)||2) - 2;
							} else if(rating && b.enteries[i].id === rating.rating.third){
								console.log('-3 - '+ b.enteries[i].id);
								b.enteries[i].points = (Number(b.enteries[i].points)||1) - 1;
							}
							if(b.enteries[i].id === Number(first)){
								console.log('+1 - '+ b.enteries[i].id);
								b.enteries[i].points = (Number(b.enteries[i].points)||0) + 3;
							} else if(b.enteries[i].id === Number(second)){
								console.log('+2 - '+ b.enteries[i].id);
								b.enteries[i].points = (Number(b.enteries[i].points)||0) + 2;
							} else if(b.enteries[i].id === Number(third)){
								console.log('+3 - '+ b.enteries[i].id);
								b.enteries[i].points = (Number(b.enteries[i].points)||0) + 1;
							}
						}
						b.save();
						res.send(b);
						if(!rating){
							rating = new Rankings();
							rating.battleid = battle;
							rating.userid = user;
						}
						rating.rating.first = first;
						rating.rating.second = second;
						rating.rating.third = third;
						rating.save();
					}else{
						res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});
						res.end();
					}
				});
			});
		}else{
			res.writeHead(400, {'content-type': 'application/json; charset=utf-8'});
 			res.end();
		}
	});
module.exports = router;