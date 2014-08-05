'use strict';

describe('Controller: NewPasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var NewpasswordctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewpasswordctrlCtrl = $controller('NewPasswordCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
