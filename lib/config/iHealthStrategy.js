var util = require('util')
  , querystring= require('querystring')
  , url = require('url')
  , format = require('string-format')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError,
    config = require('./config');

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/';
  options.tokenURL = options.tokenURL || 'https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'iHealth';
  this.userId = '';
  this.query = {};
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  if (options.APIName) {
    params['APIName'] = options.APIName;
  }
  return params;
}

/**
 * Retrieve user profile from iHealth.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id (iHealth userid)`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var params = this.query;
  delete params.code;
  delete params.grant_type;
  params.access_token = accessToken;
  params.sv = config.iHealth.OpenApiUserInfo.sv;
  params.sc = config.iHealth.OpenApiUserInfo.sc;
  var url = config.iHealth.protocol+'://'+config.iHealth.host+':'+config.iHealth.port+config.iHealth['OpenApiUserInfo'].path.format(this.userId) + querystring.stringify( params );
  console.log(url);
  this._oauth2.get(url, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      if (json.Error) { return done(new InternalOAuthError(json.ErrorDescription, err)); }

      var profile = { provider: 'iHealth' };
      profile.id = json.userid;
      profile.nickname = json.nickname;
      profile.dateofbirth = json.dateofbirth;
      profile.gender = json.gender;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

OAuth2Strategy.prototype.originalURL = function(req, options) {
  options = options || {};
  var app = req.app;
  if (app && app.get && app.get('trust proxy')) {
    options.proxy = true;
  }
  var trustProxy = options.proxy;

  var proto = (req.headers['x-forwarded-proto'] || '').toLowerCase()
    , tls = req.connection.encrypted || (trustProxy && 'https' == proto.split(/\s*,\s*/)[0])
    , host = (trustProxy && req.headers['x-forwarded-host']) || req.headers.host
    , protocol = tls ? 'https' : 'http'
    , path = req.url || '';
  return protocol + '://' + host + path;
};

OAuth2Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;

  if (req.query && req.query.error) {
    if (req.query.error == 'access_denied') {
      return this.fail({ message: req.query.error_description });
    } else {
      return this.error(new AuthorizationError(req.query.error_description, req.query.error, req.query.error_uri));
    }
  }

  var callbackURL = options.callbackURL || this._callbackURL;
  if (callbackURL) {
    var parsed = url.parse(callbackURL);
    if (!parsed.protocol) {
      // The callback URL is relative, resolve a fully qualified URL from the
      // URL of the originating request.
      callbackURL = url.resolve(this.originalURL(req, { proxy: this._trustProxy }), callbackURL);
    }
  }

  if (req.query && req.query.code) {
    var code = req.query.code;

    if (this._state) {
      if (!req.session) { return this.error(new Error('OAuth2Strategy requires session support when using state. Did you forget app.use(express.session(...))?')); }

      var key = this._key;
      if (!req.session[key]) {
        return this.fail({ message: 'Unable to verify authorization request state.' }, 403);
      }
      var state = req.session[key].state;
      if (!state) {
        return this.fail({ message: 'Unable to verify authorization request state.' }, 403);
      }

      delete req.session[key].state;
      if (Object.keys(req.session[key]).length === 0) {
        delete req.session[key];
      }

      if (state !== req.query.state) {
        return this.fail({ message: 'Invalid authorization request state.' }, 403);
      }
    }

    var params = this.tokenParams(options);
    params.grant_type = 'authorization_code';
    params.redirect_uri = callbackURL;

    params['client_id'] = this._oauth2._clientId;
    params['client_secret'] = this._oauth2._clientSecret;
    var codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code';
    params[codeParam]= code;
    this.query = params;

    var post_data= querystring.stringify( params );
    var post_headers= {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    var accessTokenUrl = this._oauth2._baseSite + this._oauth2._accessTokenUrl + "?" + post_data;

    this._oauth2._request("GET", accessTokenUrl, post_headers, null, null, function(error, data, response) {
      if( error )  callback(error);
      else {
        var params;
        try {
          // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
          // responses should be in JSON
          params= JSON.parse( data );
        }
        catch(e) {
          // .... However both Facebook + Github currently use rev05 of the spec
          // and neither seem to specify a content-type correctly in their response headers :(
          // clients of these services will suffer a *minor* performance cost of the exception
          // being thrown
          params= querystring.parse( data );
        }
        var accessToken= params["AccessToken"];
        var refreshToken= params["RefreshToken"];
        delete params["RefreshToken"];

        self.userId = params.UserID;

        self._loadUserProfile(accessToken, function(err, profile) {
          if (err) { return self.error(err); }

          function verified(err, user, info) {
            if (err) { return self.error(err); }
            if (!user) { return self.fail(info); }
            self.success(user, info);
          }

          try {
            if (self._passReqToCallback) {
              var arity = self._verify.length;
              if (arity == 6) {
                self._verify(req, accessToken, refreshToken, params, profile, verified);
              } else { // arity == 5
                self._verify(req, accessToken, refreshToken, profile, verified);
              }
            } else {
              var arity = self._verify.length;
              if (arity == 5) {
                self._verify(accessToken, refreshToken, params, profile, verified);
              } else { // arity == 4
                self._verify(accessToken, refreshToken, profile, verified);
              }
            }
          } catch (ex) {
            return self.error(ex);
          }
        });
      }
    });
   } else {
    var params = this.authorizationParams(options);
    params.response_type = 'code';
    params.redirect_uri = callbackURL;
    var scope = options.scope || this._scope;
    if (scope) {
      if (Array.isArray(scope)) { scope = scope.join(this._scopeSeparator); }
      params.scope = scope;
    }
    var state = options.state;
    if (state) {
      params.state = state;
    } else if (this._state) {
      if (!req.session) { return this.error(new Error('OAuth2Strategy requires session support when using state. Did you forget app.use(express.session(...))?')); }

      var key = this._key;
      state = uid(24);
      if (!req.session[key]) { req.session[key] = {}; }
      req.session[key].state = state;
      params.state = state;
    }

    var location = this._oauth2.getAuthorizeUrl(params);
    this.redirect(location);
  }
};

module.exports = Strategy;