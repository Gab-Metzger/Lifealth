'use strict';

var mongoose = require('mongoose'),
  mailer = require('./mailer'),
  _ = require('lodash'),
  Promise = require('promise'),
  User = mongoose.model('User');


exports.records = function (req, res) {
  User.findById(req.params.id, function (err, doctor) {
    if (doctor) {
      User.find()
        .where('role').equals('PATIENT')
        .where('links.email').in([doctor.email])
        .select('lastName firstName')
        .exec(function (err, docs) {
          if (err) return res.send(404, err);
          res.send(docs);
        });
    }
  });
};

exports.invites = function (req, res) {
  User.findById(req.params.id, function (err, doctor) {
    if (doctor && doctor.links) {
      var promises = _.map(doctor.links, function (user) {
        var p = new Promise(function (resolvep, rejectp) {
          User.findOne()
            .where('role').equals('PATIENT')
            .where('email').equals(user.email)
            .where('links.email').nin([doctor.email])
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
};

exports.findRecords = function (req, res) {
  var doctorId = req.params.id;

  User.find({lastName: new RegExp(req.query.name, 'i')})
    .where('role').equals('PATIENT')
    .where('links.id').in([doctorId])
    .limit(5)
    .select('lastName firstName')
    .exec(function (err, docs) {
      if (err) return next(err);
      res.send(docs);
    });
};

function _addRecord(doctorId, firstName, lastName, email, callback) {
  User.findByIdAndUpdate(
    doctorId,
    {$push: {'links': {email: email}}},
    {safe: true, upsert: true},
    function (err) {
      if (err) console.log(err);
      User.findOne({'role': 'PATIENT', 'email': email}, function (err, user) {
        // if patient not exists create it
        if (!err && !user) {
          // create patient user
          var user = new User({
            firstName: firstName,
            lastName: lastName,
            role: 'PATIENT',
            email: email
          });
          user.save(callback);
        }
      });
    });
}

exports.addRecord = function (req, res) {
  var email = req.body.email;
  if (email) {
    var doctorId = req.params.id;

    // add new record in records if not exists
    User.findById(doctorId, function (err, doctor) {

      // add to links
      if (_.findIndex(doctor.links, {'email': email}) == -1) {
        _addRecord(doctorId, req.body.firstName, req.body.lastName, email, function (err, user) {
          if (err) res.send(400, err);
          res.send(user, 200);
          // send email to patient
          mailer.sendMail(user, doctor);
        });
      } else {
        User.findOne({'role': 'PATIENT', 'email': email}, function (err, user) {
          res.send(user, 200);
          // send email to patient
          mailer.sendMail(user, doctor);
        })
      }
    });
  } else {
    res.send(400, 'email not set');
  }
};

exports.updateRecord = function (req, res) {

};

exports.removeRecord = function (req, res) {
  User.findById(
    req.params.id,
    function (err, doctor) {
      if (err) {
        res.send(500);
      } else {
        var drEmail = doctor.email;
        User.findByIdAndUpdate(req.params.recordId, {$pull: {links: {email: drEmail}}}, {safe: true}, function (err, user) {
          if (err) {
            res.send(500);
          } else {
            var link = _.find(doctor.links, {email: user.email})
            doctor.links.pull(link._id);
            doctor.save();
            res.send(200);
          }
        });
      }
    });

};