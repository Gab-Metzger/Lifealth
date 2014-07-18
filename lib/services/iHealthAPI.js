'use strict';

var https = require('https'),
  querystring = require('querystring'),
  config = require('../config/config'),
  format = require('string-format'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Promise = require('Promise');

var clientParams = {
  client_id: config.iHealth.clientID,
  client_secret: config.iHealth.clientSecret
};

function _refreshToken(user, accessToken, success, failure) {
  var params = clientParams;
  params.access_token = accessToken;
  params.UserID = user.iHealth.userid;
  params.response_type = 'refresh_token';
  params.redirect_uri = config.iHealth.callbackURL;
  https.get({
    host: config.iHealth.host,
    port: config.iHealth.port,
    path: config.iHealth.path
  },function (response) {
    response.on('data', function (d) {
      var data = JSON.parse(d.toString());
      if (data.Error) {
        failure(data);
      } else {
        // update user
        User.findById(user._id, function (err, user) {
          user.accessToken = data.AccessToken;
          user.refreshToken = data.RefreshToken;
          user.save();
        })
        // send access token
        success(data.AccessToken);
      }
    });
  }).on('error', function (e) {
      failure(e);
    });
}

exports.getBPDatas = function (user, accessToken, resolve, reject) {
  _getBPDatas(user, accessToken, 0, function (data) {
    var promises = [];
    for (var i = 0; i < Math.floor(data.RecordCount / data.PageLength) + 1; i++) {
      promises.push(new Promise(function (resolvep, rejectp) {
        _getBPDatas(user, accessToken, i + 1, function (data) {
          resolvep(data.BPDataList);
        }, rejectp);
      }))
    }
    Promise.all(promises).then(function (dataList) {
      resolve(dataList);
    }, reject);
  }, reject);
}

function _getBPDatas(user, accessToken, pageIndex, resolve, reject) {
  var userId = user.iHealth.userid;
  var params = clientParams;
  params.access_token = accessToken;
  params.sc = config.iHealth.OpenApiBP.sc;
  params.sv = config.iHealth.OpenApiBP.sv;
  if (pageIndex > 0) {
    params.page_index = pageIndex;
  }
  https.get({
    host: config.iHealth.host,
    port: config.iHealth.port,
    path: config.iHealth.OpenApiBP.path.format(userId) + querystring.stringify(params)
  },function (response) {
    response.on('data', function (d) {
      var data = JSON.parse(d.toString());
      if (data.Error) {
        // token expired or revoked
        if (data.ErrorCode == 4001 || data.ErrorCode == 4002) {
          // refresh token
          _refreshToken(user, accessToken, function (newAccessToken) {
            this.getBPDatas(userId, newAccessToken, resolve, reject);
          }, reject);
        } else {
          reject(data);
        }
      } else {
        resolve(data);
      }
    })
  }).on('error', function (e) {
      reject(e);
    });
}
