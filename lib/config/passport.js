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
      email: email.toLowerCase(),
      role: 'DOCTOR'
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

function _updateAndSave(user, token, tokenSecret, done) {
  user.accessToken = token;
  user.refreshToken = tokenSecret;
  user.save(function (err) {
    if (err) console.log(err);
    _updateWithDoctor(user);
    return done(err, user);
  });
};

function _updateWithDoctor(user) {
  User.find({role: 'DOCTOR', 'links.email': user.email}, function (err, doctors) {
    if (err) {
      console.log(err);
    }
    console.log('find doctors : '+doctors.length);
    if (doctors) {
      for (var i=0; i<doctors.length; i++) {
        if (!_.find(user.links, {email: doctors[i].email})) {
          console.log('update user with '+doctors[i].email);
          user.links.push({email: doctors[i].email});
            var d = doctors[i];
          user.save(function(err, user) {
              mailer.notifyDoctor(d, user);
          });
        }
      }
    }
  });
};

passport.iHealthStrategy = new iHealthStrategy({
  authorizationURL: config.iHealth.protocol+'://'+config.iHealth.host+':'+config.iHealth.port+config.iHealth.path,
  tokenURL: config.iHealth.protocol+'://'+config.iHealth.host+':'+config.iHealth.port+config.iHealth.path,
  clientID: config.iHealth.clientID,
  clientSecret: config.iHealth.clientSecret,
  callbackURL: config.iHealth.callbackURL
}, function (token, tokenSecret, profile, done) {
  console.log('user id : '+profile.id);
  console.log('user email : '+passport.email);
  User.findOne({$or: [
    {'id': profile.id},
    {'email': passport.email}
  ], 'role': 'PATIENT'}, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      user = new User({
        role: 'PATIENT',
        email: passport.email
      });
    }
    user.id = profile.id;
    user.nickname = profile.nickname;
    user.gender = profile.gender;
    user.dateofbirth = profile.dateofbirth;
    user.provider = 'iHealth';
    user.iHealth = profile._json;
    _updateAndSave(user, token, tokenSecret, done);
    passport.email = null;
  });
});

passport.use('iHealth', passport.iHealthStrategy);

module.exports = passport;
