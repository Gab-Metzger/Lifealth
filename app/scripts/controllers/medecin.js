'use strict';

angular.module('lifealthApp')
  .controller('MedecinCtrl', function ($scope, Auth) {
    $scope.logout = function() {
      Auth.logoutDoctor()
        .then(function() {
          $location.path('/');
        });
    };
  });
