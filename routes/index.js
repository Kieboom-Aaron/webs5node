var express = require('express');
var passport = require('passport');
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


passport.use(new StrategyGoogle({
    clientID: '337957115280-b8ovrndgl8ge4arrvgn3idgbtdnuf2l0.apps.googleusercontent.com',
    clientSecret: 'jeIcdXZOGQFWXbfD8e_fiL73',
    callbackURL: "http://battlerank.herokuapp.com/oauth2callback"
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
	console.log(iss, sub, profile, accessToken, refreshToken, done);

    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

router.get('/auth/google',
  passport.authenticate('google-openidconnect'));

router.get('/oauth2callback', 
  passport.authenticate('google-openidconnect', { failureRedirect: '/auth/google' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
