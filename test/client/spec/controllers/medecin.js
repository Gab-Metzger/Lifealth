'use strict';

describe('Controller: MedecinCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var MedecinCtrl,
    scope,hb,rt;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    hb = $httpBackend;
    rt = $rootScope;
    rt.currentUser = {};
    rt.currentUser.id = '123';
    MedecinCtrl = $controller('MedecinCtrl', {
      $scope: scope,
      records: []
    });
  }));

  afterEach(function() {
    hb.verifyNoOutstandingExpectation();
    hb.verifyNoOutstandingRequest();
  });

  it('should return records', function() {
    hb.expectGET('/api/doctors/'+rt.currentUser.id+'/records').respond([{'id': 123,'firstName': 'Gabriel', 'lastName': 'METZGER'}]);
    hb.flush();
    expect(scope.foundRecords.length).toBe(1);
    expect(scope.foundRecords[0].firstName).toBe('Gabriel');
  });

  it('should add a record', function() {
    scope.foundRecords = [];
    scope.email = 'gabriel.metzger@free.fr';
    scope.firstName = 'Gabriel';
    scope.lastName = 'METZGER';
    hb.expectPOST('/api/doctors/'+rt.currentUser.id+'/records',{'email': 'gabriel.metzger@free.fr','firstName': 'Gabriel', 'lastName': 'METZGER'}).respond(200, '');
    scope.addRecord();
    hb.flush();
    expect(scope.foundRecords.length).toBe(1);
  });
});
