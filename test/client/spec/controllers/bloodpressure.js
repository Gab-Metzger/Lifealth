'use strict';

describe('Controller: BloodpressureCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var BloodpressureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BloodpressureCtrl = $controller('BloodpressureCtrl', {
      $scope: scope
    });
  }));

});
