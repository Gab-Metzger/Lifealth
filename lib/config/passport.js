'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  _ = require('lodash-node'),
  passport = require('passport'),
  config = require('../config/config'),
  LocalStrategy = require('passport-local').Strategy,
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

passport.iHealthStrategy = new iHealthStrategy({
    clientID: config.iHealth.clientID,
    clientSecret: config.iHealth.clientSecret,
    callbackURL: config.iHealth.callbackURL
}, function (token, tokenSecret, profile, done) {
    User.findOne({'id': profile.id}, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            user = new User({
                id: profile.id,
                nickname: profile.nickname,
                dateofbirth: profile.dateofbirth,
                gender: profile.gender,
                provider: 'ihealth',
                role: 'PATIENT',
                email: passport.email,
                iHealth: profile._json
            });
            user.save(function (err) {
                if (err) console.log(err);
                _updateWithDoctor(user);
                return done(err, user);
            });
        } else {
            _updateWithDoctor(user);
            user.save();
            return done(err, user);
        }
    });
    //done(null,profile);
});

var _updateWithDoctor = function (user) {
  User.findOne({role: 'DOCTOR', 'links.email': user.email}, function (err, doctor) {
    if (err) {
      done(err);
    }
    if (doctor && (!_.find(user.links, {email: doctor.email}))) {
      user.links.push({email: doctor.email});
      user.save();
    }
  })
};

passport.use('iHealth', new iHealthStrategy({
  clientID: config.iHealth.clientID,
  clientSecret: config.iHealth.clientSecret,
  callbackURL: config.iHealth.callbackURL
}, function (token, tokenSecret, profile, done) {
  User.findOne({'id': profile.id}, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      user = new User({
        id: profile.id,
        nickname: profile.nickname,
        dateofbirth: profile.dateofbirth,
        gender: profile.gender,
        provider: 'ihealth',
        role: 'PATIENT',
        email: passport.email,
        iHealth: profile._json
      });
      user.save(function (err) {
        if (err) console.log(err);
        _updateWithDoctor(user);
        return done(err, user);
      });
    } else {
      _updateWithDoctor(user);
      user.save();
      return done(err, user);
    }
  });
  //done(null,profile);
}));

module.exports = passport;
