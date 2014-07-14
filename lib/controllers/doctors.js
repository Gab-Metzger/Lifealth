'use strict';

var mongoose = require('mongoose'),
  mailer = require('./mailer'),
  User = mongoose.model('User');


exports.records = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    res.send(user.links.toObject());
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

function _addRecord(doctorId, email, callback) {
  User.findByIdAndUpdate(
    doctorId,
    {$push: {'links': {email: email}}},
    {safe: true, upsert: true},
    callback);
}

exports.addRecord = function (req, res) {
  var email = req.body.email;
  if (email) {
    var doctorId = req.params.id;
    // send email to patient
    mailer.sendMail(email);

    // add new record in records if not exists
    User.findOne({_id: doctorId, 'links.email': email}, function (err, user) {
      if (!user) {
        _addRecord(doctorId, email, function (err, user) {
          if (err) return next(err);
          res.send(200);
        });
      } else {
        res.send(200);
      }
    });
  } else {
    res.send(400, 'email not set');
  }
};

exports.updateRecord = function (req, res) {

};

exports.removeRecord = function(req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {$pull: {'links': {_id: req.params.recordId}}},
    {safe: true, upsert: true},
    function(err, user) {
      if (err) {
        res.send(500);
      } else {
        res.send(200);
      }
    });

};