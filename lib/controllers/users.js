'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  mailer = require('./mailer.js'),
  Promise = require('promise'),
  _ = require('lodash'),
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
exports.update = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (req.body.oldPassword && req.body.newPassword && !user.authenticate(oldPass)) {
      res.send(403);
    } else {
      user.email = req.body.email;
      user.lastName = req.body.lastName;
      user.firstName = req.body.firstName;
      user.gender = req.body.gender;
      user.dateofbirth = req.body.dateofbirth;
      if (req.body.newPassword) {
        user.password = newPass;
      }
      user.save(function (err) {
        if (err) return res.send(400);

        res.send(200);
      });
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
  if (req.body) {
    var userId = req.params.id;
    if (userId) {
      User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (user) {
          var bpId = req.body._id;
          if (bpId) {
            var bpData = user.bpDatas.id(req.body._id);
            if (bpData) {
              bpData.HP = req.body.HP;
              bpData.LP = req.body.LP;
              bpData.MDate = req.body.MDate;
              bpData.HR = req.body.HR;
            }
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
};

exports.updateBgData = function (req, res, next) {
  if (req.body) {
    var userId = req.params.id;
    if (userId) {
      User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (user) {
          var bgId = req.body._id;
          if (bgId) {
            var bgData = user.bgDatas.id(req.body._id);
            if (bgData) {
              bgData.DinnerSituation = req.body.DinnerSituation;
              bgData.BG = req.body.BG;
              bgData.MDate = req.body.MDate;
            }
          } else {
            var i = user.bgDatas.unshift(req.body);
            bgId = user.bgDatas[i - 1]._id.toString();
          }
          user.save(function (err) {
            if (err) res.send(500, "Erreur à l'enregistrement de la donnée " + req.body);
            else res.send(200, bgId);
          });
        }
      });
    }
  }
};

exports.removeBgData = function (req, res, next) {
  var userId = req.params.id;
  if (userId) {
    User.findByIdAndUpdate(userId, {$pull: {bgDatas: {_id: req.params.bgId}}}, function (err, user) {
      if (err) res.send(500, "Erreur à la suppression de la donnée " + req.body);
      else res.send(200);
    });
  }
};

exports.getBgData = function (req, res, next) {
  var userId = req.params.id;
  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) res.send(500, "Erreur à la récupération de la donnée " + req.params.bgId);
      else res.send(200, user.bgDatas.id(req.params.bgId));
    })
  }
};

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

exports.unlink = function(req, res, next) {
  var userId = req.params.id;

  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) return next(err);

      if (user) {
        user.iHealth = null;
        user.save(function(err, user) {
          res.send(200);
        });
      }
    });
  }
};

exports.doctors = function(req, res, next) {
  var userId = req.params.id;

  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) return next(err);

      if (user.links) {
        var promises = _.map(user.links, function (doctor) {
          var p = new Promise(function (resolvep, rejectp) {
            User.findOne()
              .where('role').equals('DOCTOR')
              .where('email').equals(doctor.email)
              .select('lastName firstName')
              .exec(function (err, user) {
                if (err) return rejectp(user);
                resolvep(user);
              });
          });
          return p;
        });
        Promise.all(promises).then(function (results) {
          res.send(_.filter(results, function (item) {
            if (item) return true;
            else return false;
          }));
        }, function (err) {
          console.log(err);
        });
      }
    });
  }
};

exports.removeDoctor = function(req, res) {
  User.findById(req.params.doctorId, function(err, doctor) {
    if (err) res.send(500, err);
    else if (doctor) {
      User.findByIdAndUpdate(req.params.id, {$pull: {links: {email: doctor.email}}}, {safe: true}, function (err, user) {
        console.log('remove email '+doctor.email+' from links '+user.links);
        var link = _.find(doctor.links, {email: user.email});
        doctor.links.pull(link._id);
        doctor.save();
        res.send(200);
      });
    } else res.send(404);
  });
};


/**
 * Get current user
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};


