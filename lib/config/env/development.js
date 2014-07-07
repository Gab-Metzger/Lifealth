'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  },
  iHealth: {
    apis: {APIName: 'OpenApiBG OpenApiBP OpenApiUserInfo', RequiredAPIName: 'OpenApiBG OpenApiBP OpenAPIUserInfo'},
    clientID: 'dca6ac026aad4d9aad5fd634ab553927',
    clientSecret: '351a51fe97244a5d8db267477362fda7',
    callbackURL: 'http://lifealth.com/auth/iHealth/callback',
    OpenApiActivity: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '5E9CEAC07E88409CBE4AEC2A813D34CC'
    },
    OpenApiBG: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '11AE94A7699D43F69145EEAD96F0B91A'
    },
    OpenApiBP: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: 'B4B36953EC8F4303AF88971CA3340152'
    },
    OpenApiUserInfo: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '0B79266124744421AEF845320F815E77'
    }
  },
  iHealth2: {
    apis: {APIName: 'OpenApiBG OpenApiBP', RequiredAPIName: 'OpenApiBG OpenApiBP'},
    clientID: '16954dda6cdb4905958cd2c3b8347ce8',
    clientSecret: '11becb0ad7cf484f91800c488343919c',
    callbackURL: 'http://localhost:9000/auth/iHealth/callback',
    OpenApiActivity: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '5E9CEAC07E88409CBE4AEC2A813D34CC'
    },
    OpenApiBG: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: '11AE94A7699D43F69145EEAD96F0B91A'
    },
    OpenApiBP: {
      sc: 'F3E8CDB147C84F8D930A3B1AB7960508',
      sv: 'B4B36953EC8F4303AF88971CA3340152'
    },
    OpenApiUserInfo: {
      sc: '',
      sv: ''
    }
  }
};