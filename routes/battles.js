var router = require('express').Router();

router
	.get('/',function(req, res){
		res.send('battles');
	})
	.post('/', function(req, res){
		res.send('add battle');
		});
module.exports = router;