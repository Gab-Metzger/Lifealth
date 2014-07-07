'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  config = require('../config/config'),
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
    id: id
  }, function (err, user) {
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
  clientID: config.iHealth.clientID,
  clientSecret: config.iHealth.clientSecret,
  callbackURL: config.iHealth.callbackURL
}, function (token, tokenSecret, profile, done) {
  console.log('TODO : create user');
  User.findOne({'id': profile.id}, function(err, user) {
      if (err) {
          return done(err);
      }

      if(!user) {
          user = new User({
              id: profile.id,
              nickname: profile.nickname,
              dateofbirth: profile.dateofbirth,
              gender: profile.gender,
              provider: 'ihealth',
              iHealth: profile._json
          });
          user.save(function(err) {
              if(err) console.log(err);
              return done(err,user);
          });
      } else {
          return done(err, user);
      }
  });
  //done(null,profile);
}));

module.exports = passport;
