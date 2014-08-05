'use strict';

describe('Controller: MedecinCtrl', function () {

  // load the controller's module
  beforeEach(module('lifealthApp'));

  var MedecinCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MedecinCtrl = $controller('MedecinCtrl', {
      $scope: scope
    });
  }));

  //it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  //});
});
