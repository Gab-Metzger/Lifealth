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
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
         'mongodb://localhost/fullstack'
  },
  iHealth: {
    host: 'api.ihealthlabs.com',
    port: '8443',
    path: '/OpenApiV2/OAuthv2/userauthorization/',
    apis: {APIName: 'OpenApiBG OpenApiBP OpenApiUserInfo', RequiredAPIName: 'OpenApiBG OpenApiBP OpenApiUserInfo'},
    clientID: '16954dda6cdb4905958cd2c3b8347ce8',
    clientSecret: '11becb0ad7cf484f91800c488343919c',
    callbackURL: 'http://demo.lifealth.com/auth/iHealth/callback',
    OpenApiActivity: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '5E9CEAC07E88409CBE4AEC2A813D34CC'
    },
    OpenApiBG: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '11AE94A7699D43F69145EEAD96F0B91A'
    },
    OpenApiBP: {
      path: '/openapiv2/user/{0}/bp.json/?',
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: 'B4B36953EC8F4303AF88971CA3340152'
    },
    OpenApiUserInfo: {
      sc: 'f3e8cdb147c84f8d930a3b1ab7960508',
      sv: '0b79266124744421aef845320f815e77'
    }
  }
};