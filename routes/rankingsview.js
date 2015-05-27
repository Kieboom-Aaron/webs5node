var router = require('express').Router(),
	mongoose = require('mongoose'),
	Rankings = mongoose.model('Rankings'),
	Battles = mongoose.model('Battles');

/* HTML VIEWS */
router.get('/', function(req, res){
	Battles.find(function(err, data){
		data = data || [];
		res.render('rankings', {
	        title: 'Rankings',
	        battles: data
	    });
	});
});

router.get('/:id', function(req, res, next) {
    Battles.findOne({
        id: req.params.id,
        sortby: 'points'
    }, function(err, data) {
    	console.log(err, data);
        res.render('ranking', {
            title: data.name,
            ranking: data
        });
    });
});

module.exports = router;