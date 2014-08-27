'use strict';

describe('Controller: GlucoseCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var GlucoseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GlucoseCtrl = $controller('GlucoseCtrl', {
      $scope: scope
    });
  }));

});
