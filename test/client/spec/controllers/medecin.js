'use strict';

describe('Controller: MedecinCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var MedecinCtrl,
    scope,hb,rt;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    scope.form = {
      $valid: true,
      $setPristine: function() {}
    };
    hb = $httpBackend;
    rt = $rootScope;
    rt.currentUser = {};
    rt.currentUser.id = '123';
    MedecinCtrl = $controller('MedecinCtrl', {
      $scope: scope,
      records: [],
      invites: []
    });
  }));

  afterEach(function() {
    hb.verifyNoOutstandingExpectation();
    hb.verifyNoOutstandingRequest();
  });

  it('should add a record', function() {
    scope.foundRecords = [{
      'email': 'jean.dupont@test.fr',
      'firstName': 'Jean',
      'lastName': 'Dupont'
    }];
    scope.email = 'gabriel.metzger@free.fr';
    scope.firstName = 'Gabriel';
    scope.lastName = 'METZGER';
    hb.expectPOST('/api/doctors/'+rt.currentUser.id+'/records',{'email': 'gabriel.metzger@free.fr','firstName': 'Gabriel', 'lastName': 'METZGER'}).respond(200, '');
    scope.addRecord();
    hb.flush();
    expect(scope.foundRecords.length).toBe(1);
  });

  it('should delete a record', function() {
    scope.foundRecords = [{
      '_id': 123,
      'email': 'jean.dupont@test.fr',
      'firstName': 'Jean',
      'lastName': 'Dupont'
    }];
    hb.expectDELETE('/api/doctors/'+rt.currentUser.id+'/records/123').respond(201,'');
    scope.deleteRecord(scope.foundRecords[0]);
    hb.flush();
    expect(scope.foundRecords.length).toBe(0);
  });

  it('should construct firstname+lastname', function() {
    scope.foundRecords = [{
      '_id': 123,
      'email': 'jean.dupont@test.fr',
      'firstName': 'Jean',
      'lastName': 'Dupont'
    }];
    var name = scope.name(scope.foundRecords[0]);
    expect(name).toBe('Jean Dupont');
  });
});
