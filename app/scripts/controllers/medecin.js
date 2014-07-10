'use strict';

angular.module('lifealthApp')
  .controller('MedecinCtrl', function ($scope, Auth, $location) {
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };
  });
