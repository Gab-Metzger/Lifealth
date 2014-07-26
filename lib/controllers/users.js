'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  iHealthAPI = require('../services/iHealthAPI');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function (err) {
    if (err) return res.json(400, err);

    req.logIn(newUser, function (err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get Bood pressure datas
 */
exports.getBPDatas = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);

    iHealthAPI.getBPDatas(user, user.accessToken, req.query.from, req.query.to, function (data) {
        res.send(data);
    }, function (err) {
      console.log(err);
    });
  });
};

/**
 * Get Glucometry datas
 */
exports.getBGDatas = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) return next(err);

        iHealthAPI.getBGDatas(user, user.accessToken, req.query.from, req.query.to, function (data) {
            res.send(data);
        }, function (err) {
            console.log(err);
        });
    });
};

/**
 * Get current user
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};


