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

router.get('/:id', function(req, res, next) {
    Battles.findOne({
        id: req.params.id
    }, function(err, data) {
    	console.log(data);
        res.render('pick', {
            title: data.name,
            battle: data,
            scripts: ['../js/battlepicker.js']
        });
    });
});

module.exports = router;