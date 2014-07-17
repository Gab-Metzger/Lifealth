'use strict';

var https = require('https'),
  querystring = require('querystring'),
  config = require('../config/config'),
  format = require('string-format'),
  Promise = require('Promise');

exports.getBPDatas = function (userId, accessToken, resolve, reject) {
  var params = {
    access_token: accessToken,
    sc: config.iHealth.OpenApiBP.sc,
    sv: config.iHealth.OpenApiBP.sv,
    client_id: config.iHealth.clientID,
    client_secret: config.iHealth.clientSecret
  };
  https.get({
    host: config.iHealth.host,
    port: config.iHealth.port,
    path: config.iHealth.OpenApiBP.path.format(userId) + querystring.stringify(params)
  },function (response) {
    response.on('data', function (d) {
      var data = JSON.parse(d.toString());
      if (data.Error) {
        reject(data);
      }
      resolve(data);
    })
  }).on('error', function (e) {
      reject(e);
    });
}
