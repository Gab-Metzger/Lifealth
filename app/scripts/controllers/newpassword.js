'use strict';

angular.module('lifealthApp')
  .controller('NewPasswordCtrl', function ($scope, $location, $materialToast, Auth, $http) {
    $scope.changePassword = function (form) {
      $scope.error = null;
      if (form.$valid) {
        $http.post('/changePassword', {password: $scope.password})
          .success(function (data) {
            $location.path('/medecin');
          }).error(function (err) {
           $scope.error = err;
          });
      }
    }
  });
