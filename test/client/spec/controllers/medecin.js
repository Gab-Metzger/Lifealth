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
    MedecinCtrl = $controller;
  }));

  //it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  //});
  it('should return records', function() {
    hb.expectGET('/api/doctors/'+rt.currentUser.id+'/records').respond([{'id': 123,'firstName': 'Gabriel', 'lastName': 'METZGER'}]);
    MedecinCtrl('MedecinCtrl', {
      $scope: scope
    });
    hb.flush();
    expect(scope.data).toBe(1);
  });
});
