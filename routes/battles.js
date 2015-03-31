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
 					console.log(filekey);
 				}
 				res.send('your a gonner');
    		}
	      
	    });
	});
module.exports = router;