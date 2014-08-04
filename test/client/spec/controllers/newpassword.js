'use strict';

describe('Controller: NewpasswordctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var NewpasswordctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewpasswordctrlCtrl = $controller('NewpasswordctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
