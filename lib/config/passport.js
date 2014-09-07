'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  _ = require('lodash-node'),
  passport = require('passport'),
  config = require('../config/config'),
  LocalStrategy = require('passport-local').Strategy,
    mailer = require('../controllers/mailer.js'),
    iHealthStrategy = require('./iHealthStrategy');


// temp store email for patient auth
passport.email = undefined;
passport.userId = undefined;

/**
 * Passport configuration
 */
passport.serializeUser(function (user, done) {
  done(null, user._id.toString());
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
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

      if (passport.email && passport.email.toLowerCase() != email.toLowerCase()) {
        return done(null, false, {
          message: 'Email renseigné différent de l\'email d\'invitation'
        })
      }
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
      if (passport.email) {
        User.find({role: 'DOCTOR', 'links.email': passport.email}, function (err, doctors) {
          if (err) {
            console.log(err);
          }
          console.log('find doctors : ' + doctors.length);
          user.updateWithDoctors(doctors, function(d) {
            mailer.notifyDoctor(d, user);
          });
          user.save();
        });

      }
      return done(null, user);
    });
  }
));

function _updateAndSave(user, token, tokenSecret, done) {
  user.accessToken = token;
  user.refreshToken = tokenSecret;
  User.find({role: 'DOCTOR', 'links.email': user.email}, function (err, doctors) {
    if (err) {
      console.log(err);
    }
    console.log('find doctors : ' + doctors.length);
    user.updateWithDoctors(doctors, function(d) {
      mailer.notifyDoctor(d, user);
    });
    user.save();
  });
  user.save(function (err) {
    if (err) console.log(err);
    return done(err, user);
  });
};

passport.iHealthStrategy = new iHealthStrategy({
  authorizationURL: config.iHealth.protocol+'://'+config.iHealth.host+':'+config.iHealth.port+config.iHealth.path,
  tokenURL: config.iHealth.protocol+'://'+config.iHealth.host+':'+config.iHealth.port+config.iHealth.path,
  clientID: config.iHealth.clientID,
  clientSecret: config.iHealth.clientSecret,
  callbackURL: config.iHealth.callbackURL
}, function (token, tokenSecret, profile, done) {
  User.findById(passport.userId, function (err, user) {
    if (err) {
      return done(err);
    }

    user.id = profile.id;
    user.nickname = profile.nickname;
    user.gender = profile.gender;
    user.dateofbirth = profile.dateofbirth;
    user.iHealth = profile._json;
    _updateAndSave(user, token, tokenSecret, done);
    passport.email = null;
  });
});

passport.use('iHealth', passport.iHealthStrategy);

module.exports = passport;
