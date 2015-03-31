var router = require('express').Router(),
	mongoose = require('mongoose'),
	Battles = mongoose.model('Battles'),
	formidable = require('formidable');

router
	.get('/',function(req, res){
		Battles.find(function(err, data){
			data = data || [];
			res.send(data);
		});
	})
	.post('/', function(req, res){
		var form = new formidable.IncomingForm();
    	form.parse(req, function(err, fields, files) {
    		if(err){
    			res.writeHead(500, {'content-type': 'text/plain'});
    			res.end();
    		}else{
 				var battle = new Battles();
 				battle.name = fields.name;
 				var enteries = [];
 				for(var filekey in files){
 					var entery = {
 						title: fields[filekey+'_title'],
 						description: fields[filekey+'_description'],
 						image:'path_to_random_file'
 					};
 					enteries.push(entery);
 				}
 				battle.enteries = enteries;
 				Battles.findOne()
    				.where({id: {'$ne':null}})
				    .sort('-id')
				    .exec(function(err, doc)
				    {
				    	doc = doc || {id:-1};
				        battle.id = (Number(doc.id) + 1);
				        battle.save(function(err, result){
		 					res.send(err+'----'+result);
		 				});
				    });
    		}
	      
	    });
	});
module.exports = router;