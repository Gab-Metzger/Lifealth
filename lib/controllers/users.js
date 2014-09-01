'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  mailer = require('./mailer.js'),
  iHealthAPI = require('../services/iHealthAPI');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var aUser = new User(req.body);
  aUser.provider = 'local';
  aUser.save(function (err) {
    if (err) return res.json(400, err);

    if (aUser.role == 'PATIENT') {
      User.find({role: 'DOCTOR', 'links.email': req.body.email}, function (err, doctors) {
        if (err) {
          console.log(err);
        }
        console.log('find doctors : ' + doctors.length);
        aUser.updateWithDoctors(doctors, function (d) {
          mailer.notifyDoctor(d, aUser);
        });
        aUser.save();
      });
    }

    req.logIn(aUser, function (err) {
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

    res.send({profile: user.profile});
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
 * Get Blood pressure datas
 */
exports.getBPDatas = function (req, res, next) {
  var userId = req.params.id;

  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) return next(err);

      if (user) {
        if (user.iHealth && user.iHealth.userid) {
          iHealthAPI.getBPDatas(user, user.accessToken, req.query.from, req.query.to, function (data) {
            if (user.bpDatas.length == 0) {
              res.send(data);
            } else {
              res.send(data.concat(user.bpDatas).sort(sortByMDate));
            }
          }, function (err) {
            res.send(400, err);
          });
        } else {
          res.send(user.bpDatas.sort(sortByMDate));
        }
      }
    });
  }
};

var sortByMDate = function (a, b) {
  return b.MDate - a.MDate
};

exports.updateBpData = function (req, res, next) {
  var userId = req.params.id;
  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) return next(err);
      if (user) {
        var bpId = req.body._id;
        if (bpId) {
          var bpData = user.bpDatas.id(req.body._id);
          bpData.HP = req.body.HP;
          bpData.LP = req.body.LP;
          bpData.MDate = req.body.MDate;
          bpData.HR = req.body.HR;
        } else {
          var i = user.bpDatas.unshift(req.body);
          bpId = user.bpDatas[i - 1]._id.toString();
        }
        user.save(function (err) {
          if (err) res.send(500, "Erreur à l'enregistrement de la donnée " + req.body);
          else res.send(200, bpId);
        });
      }
    });
  }
};

exports.removeBpData = function (req, res, next) {
  var userId = req.params.id;
  if (userId) {
    User.findByIdAndUpdate(userId, {$pull: {bpDatas: {_id: req.params.bpId}}}, function (err, user) {
      if (err) res.send(500, "Erreur à la suppression de la donnée " + req.body);
      else res.send(200);
    });
  }
};

exports.getBpData = function (req, res, next) {
  var userId = req.params.id;
  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) res.send(500, "Erreur à la récupération de la donnée " + req.params.bpId);
      else res.send(200, user.bpDatas.id(req.params.bpId));
    })
  }
}


/**
 * Get Glucometry datas
 */
exports.getBGDatas = function (req, res, next) {
  var userId = req.params.id;

  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) return next(err);

      if (user) {
        if (user.iHealth && user.iHealth.userid) {
          iHealthAPI.getBGDatas(user, user.accessToken, req.query.from, req.query.to, function (data) {
            if (user.bgDatas.length == 0) {
              res.send(data);
            } else {
              res.send(data.concat(user.bgDatas).sort(sortByMDate));
            }
          }, function (err) {
            res.send(400, err);
          });
        } else {
          res.send(user.bgDatas.sort(sortByMDate));
        }
      }
    });
  }
};

/**
 * Get current user
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};


