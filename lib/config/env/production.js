'use strict';

module.exports = {
  env: 'production',
  domain: 'demo.lifealth.com',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
  mongo: {
    uri: process.env.APPSDECK_MONGO_URL || 'mongodb://localhost/lifealth'
  },
  iHealth: {
    protocol: 'https',
    host: 'api.ihealthlabs.com',
    port: '8443',
    path: '/OpenApiV2/OAuthv2/userauthorization/',
    apis: {APIName: 'OpenApiBG OpenApiBP OpenApiUserInfo', RequiredAPIName: 'OpenApiBG OpenApiBP OpenApiUserInfo'},
    clientID: '50694ce48a464f4bbdaf71eb92e34d25',
    clientSecret: '86ea4c70de9a40b6bcea3dd5ca63bc0f',
    callbackURL: 'http://demo.lifealth.com/auth/iHealth/callback',
    OpenApiBG: {
      path: '/openapiv2/user/{0}/glucose.json/?',
      sc: 'f3e8cdb147c84f8d930a3b1ab7960508',
      sv: '11ae94a7699d43f69145eead96f0b91a'
    },
    OpenApiBP: {
      path: '/openapiv2/user/{0}/bp.json/?',
      sc: 'f3e8cdb147c84f8d930a3b1ab7960508',
      sv: 'b4b36953ec8f4303af88971ca3340152'
    },
    OpenApiUserInfo: {
      path: '/openapiv2/user/{0}.json/?',
      sc: 'f3e8cdb147c84f8d930a3b1ab7960508',
      sv: '0b79266124744421aef845320f815e77'
    }
  },
  iHealthSandbox: {
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