'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location) {
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };
  });
