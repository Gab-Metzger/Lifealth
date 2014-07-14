'use strict';

var mongoose = require('mongoose'),
    passport = require('../config/passport');

/**
 * Get awesome things
 */
exports.subscribe = function(req, res) {
  passport.email = req.query.email;
  res.redirect('/#/loginPatient');
};