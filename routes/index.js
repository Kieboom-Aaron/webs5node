var express = require('express');
var passport = require('passport');
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
	
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
passport.use(new StrategyGoogle({
    clientID: '337957115280-b8ovrndgl8ge4arrvgn3idgbtdnuf2l0.apps.googleusercontent.com',
    clientSecret: 'jeIcdXZOGQFWXbfD8e_fiL73',
    callbackURL: 'http://battlerank.herokuapp.com/auth/google/callback',
    skipUserProfile: true // doesn't fetch user profile
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

router.get('/auth/google',
  passport.authenticate('google-openidconnect'));

router.get('/auth/google/callback', 
  passport.authenticate('google-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



module.exports = router;
