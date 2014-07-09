'use strict';

describe('Controller: PatientCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var PatientCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PatientCtrl = $controller('PatientCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
