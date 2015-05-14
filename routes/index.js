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
    	done(true);
    }
));

router.get('/auth/google',
    passport.authenticate('google-openidconnect'));

router.get('/auth/google/callback', function(req, res){
    if(req.query.code){
        req.session.google = req.query.code;
        res.redirect('/');
    }else{
        res.redirect('/auth/google');
    }
});

module.exports = router;