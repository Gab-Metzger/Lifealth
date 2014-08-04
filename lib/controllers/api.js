'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  uuid = require('node-uuid'),
  mailer = require('./mailer.js'),
  passport = require('../config/passport');

/**
 * Get awesome things
 */
exports.subscribe = function (req, res) {
  req.session.email = req.query.email;
  res.redirect('/#/loginPatient');
};

exports.lostPassword = function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (user) {
      req.session.resetpwdid = uuid.v4();
      user.uuid = req.session.resetpwdid;
      user.save();
      mailer.sendMailLostPassword(user, req.session.resetpwdid);
      res.send(200);
    } else {
      res.send(404, 'Email inconnu');
    }
  })
}

exports.newPassword = function (req, res) {
  if (req.session.resetpwdid == req.params.id) {
    res.redirect('/#/newPassword');
  }
}

exports.changePassword = function (req, res) {
  if (req.session.resetpwdid) {
    User.findOne({uuid: req.session.resetpwdid}, function(err, user) {
      if (user) {
        user.password = req.body.password;
        user.uuid = null;
        user.save();
        req.session.resetpwdid = null;
        res.send(200);
      } else {
        res.send(400, 'Impossible de changer le mot de passe. Utilisateur introuvable.');
      }
    });
  } else {
    res.send(400, 'Impossible de changer le mot de passe. Jeton expiré.');
  }
}