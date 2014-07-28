'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
  mongo: {
    uri: process.env.APPSDECK_MONGO_URL
  },
  iHealth: {
    protocol: 'http',
    host: 'sandboxapi.ihealthlabs.com',
    port: '80',
    path: '/OpenApiV2/OAuthv2/userauthorization/',
    apis: {APIName: 'OpenApiBG OpenApiBP OpenApiUserInfo', RequiredAPIName: 'OpenApiBG OpenApiBP OpenApiUserInfo'},
    clientID: '239fa7ad547d46d8bf20eaf7dc210f4f',
    clientSecret: '9f47585fd20a4bb18fb34a50499bfdd2',
    callbackURL: 'http://demo.lifealth.com/auth/iHealth/callback',
    OpenApiBG: {
      path: '/openapiv2/user/{0}/glucose.json/?',
      sc: '6BBACB94D2C34FF0A001F3CC8BD4F267',
      sv: '99C45EC2B03448728D548347CC570F16'
    },
    OpenApiBP: {
      path: '/openapiv2/user/{0}/bp.json/?',
      sc: '6BBACB94D2C34FF0A001F3CC8BD4F267',
      sv: 'BEB2252421D34AC5BE76808669CEFE95'
    },
    OpenApiUserInfo: {
      path: '/openapiv2/user/{0}.json/?',
      sc: '6BBACB94D2C34FF0A001F3CC8BD4F267',
      sv: 'CA331B80903244FEA863B08E66E83276'
    }
  }
};