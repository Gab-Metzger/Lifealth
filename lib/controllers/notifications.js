'use strict';

var mongoose = require('mongoose');


exports.new = function(req, res) {
  console.log('notification receive');
  console.log(req.body);
  res.send(200);
};