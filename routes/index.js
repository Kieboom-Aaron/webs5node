var express = require('express');
var passport = require('passport');
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
var mongoose = require('mongoose');
var router = express.Router();

var Users = mongoose.model('Users');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', {
        title: 'Express'
    });
});


//GOOGLE OpenID Connecta
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
passport.use(new StrategyGoogle({
        clientID: '337957115280-b8ovrndgl8ge4arrvgn3idgbtdnuf2l0.apps.googleusercontent.com',
        clientSecret: 'jeIcdXZOGQFWXbfD8e_fiL73',
        callbackURL: 'http://battlerank.herokuapp.com/auth/google/callback',
        skipUserProfile: true // doesn't fetch user profile
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
    	console.log(profile.id);
    	Users.findOne({googleId: profile.id}, function(err, data){
    		var user;
    		if(!data){
    			user = new Users({googleId: profile.id});
    			user.save(function(error){
					console.log(error);
    			});
    		} else{
    			user = data;
    		}

    		console.log(user);
    		done(true);
    	});
    }
));

router.get('/auth/google',
    passport.authenticate('google-openidconnect'));

router.get('/auth/google/callback',
    passport.authenticate('google-openidconnect', {
        failureRedirect: '/auth/google'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.send(req);
        //res.redirect('/');
    });

module.exports = router;