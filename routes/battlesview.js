var router = require('express').Router(),
	mongoose = require('mongoose'),
	Battles = mongoose.model('Battles');
	// formidable = require('formidable'),
	// imgur = require('imgur'),
	// fs = require('fs');

/* HTML VIEWS */
router.get('/', function(req, res){
	Battles.find(function(err, data){
		data = data || [];
		res.render('battles', {
	        title: 'Battles',
	        battles: data
	    });
	});
});

module.exports = router;