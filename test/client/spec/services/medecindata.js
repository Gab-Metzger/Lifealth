'use strict';

describe('Service: MedecinData', function () {

  // load the service's module
  beforeEach(module('lifealthApp'));

  // instantiate service
  var pd;
  var hb,rt;
  beforeEach(inject(function (_MedecinData_, $httpBackend, $rootScope) {
    md = _MedecinData_;
    hb = $httpBackend;
    rt = $rootScope;
    rt.currentUser = {};
    rt.currentUser.id = '123';
  }));

  it('should return one record', function () {
    var data = [];
  });

});
