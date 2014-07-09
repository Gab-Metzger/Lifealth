'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth) {
    $scope.logout = function() {
      Auth.logoutPatient()
        .then(function() {
          $location.path('/');
        });
    };
  });
