'use strict';

var mongoose = require('mongoose'),
    passport = require('../config/passport');

/**
 * Get awesome things
 */
exports.subscribe = function(req, res) {
  req.session.email = req.query.email;
  res.redirect('/#/loginPatient');
};