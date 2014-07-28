'use strict';

var config = require('../config/config'),
  https = require(config.iHealth.protocol),
  querystring = require('querystring'),
  format = require('string-format'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Promise = require('Promise');

function _refreshToken(user, accessToken, success, failure) {
  var params = {};
  params.client_id = config.iHealth.clientID;
  params.client_secret = config.iHealth.clientSecret;
  params.access_token = accessToken;
  params.UserID = user.iHealth.userid;
  params.response_type = 'refresh_token';
  params.redirect_uri = config.iHealth.callbackURL;
  https.get({
    host: config.iHealth.host,
    port: config.iHealth.port,
    path: config.iHealth.path
  }, function (response) {
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
        });
        // send access token
        success(data.AccessToken);
      }
    });
  }).on('error', function (e) {
      failure(e);
    });
}

exports.getBPDatas = function(user, accessToken, from, to, resolve, reject) {
  _getDatasForApi('OpenApiBP', 'BPDataList', user, accessToken, from, to, resolve, reject);
}

exports.getBGDatas = function(user, accessToken, from, to, resolve, reject) {
  _getDatasForApi('OpenApiBG', 'BGDataList', user, accessToken, from, to, resolve, reject);
}

function _getDatasForApi(api, apiListKey, user, accessToken, from, to, resolve, reject) {
  _getDatas(api, user, accessToken, 1, from, to, function (data) {
    var promises = [];
    var pageCount = Math.floor(data.RecordCount / data.PageLength);
    if (pageCount > 0) {
      var dataPage1 = data;
      for (var i = 1; i < pageCount + 1; i++) {
        promises.push(new Promise(function (resolvep, rejectp) {
          _getDatas(api, user, accessToken, i + 1, from, to, function (data) {
            resolvep(data[apiListKey]);
          }, rejectp);
        }))
      }
      Promise.all(promises).then(function (dataList) {
        dataList.splice(0, 0, dataPage1);
        resolve(dataList);
      }, reject);
    } else {
      resolve([data[apiListKey]]);
    }
  }, reject);
}


function _getDatas(api, user, accessToken, pageIndex, fromTime, toTime, resolve, reject) {
  var userId = user.iHealth.userid;
  var params = {};
  params.client_id = config.iHealth.clientID;
  params.client_secret = config.iHealth.clientSecret;
  params.access_token = accessToken;
  params.sc = config.iHealth[api].sc;
  params.sv = config.iHealth[api].sv;
  if (pageIndex > 0) {
    params.page_index = pageIndex;
  }
  if (fromTime) {
    params.start_time = fromTime;
  }
  if (toTime) {
    params.end_time = toTime;
  }
  https.get({
    host: config.iHealth.host,
    port: config.iHealth.port,
    path: config.iHealth[api].path.format(userId) + querystring.stringify(params)
  },function (response) {
    response.on('data', function (d) {
      var data = JSON.parse(d.toString());
      if (data.Error) {
        // token expired or revoked
        if (data.ErrorCode == 4001 || data.ErrorCode == 4002) {
          // refresh token
          _refreshToken(user, accessToken, function (newAccessToken) {
            _getDatas(api, user, newAccessToken, pageIndex, fromTime, toTime, resolve, reject);
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
