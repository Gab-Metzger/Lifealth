'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  OAuthStrategy = require('./iHealthStrategy');

/**
 * Passport configuration
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function (err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use('iHealth', new OAuthStrategy({
  clientID: 'dca6ac026aad4d9aad5fd634ab553927',
  clientSecret: '351a51fe97244a5d8db267477362fda7',
  callbackURL: 'http://lifealth.com/auth/iHealth/callback'
}, function (token, tokenSecret, profile, done) {
  console.log('TODO : create user');
  done(null,profile);
}));

module.exports = passport;
