'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('../config/config');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  //req.session.destroy();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};

exports.auth = function(req, res, next) {
  passport.email = req.session.email;
  passport.authenticate('iHealth', config.iHealth.apis)(req, res, next);
  req.session.email = null;
};

exports.authCallback = function(req, res, next) {
  console.log('request body : '+req.body);
  passport.authenticate('iHealth', {
    successRedirect: '/#/patient',
    failureRedirect: '/#/loginPatient'
  })(req, res, next);
};