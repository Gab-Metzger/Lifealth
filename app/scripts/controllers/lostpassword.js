'use strict';

angular.module('lifealthApp')
  .controller('LostPasswordCtrl', function ($scope, $materialToast, $http) {
    $scope.sendEmail = function (form) {
      $scope.error = null;
      if (form.$valid) {
        $http.post('/lostPassword', {email: $scope.email})
          .success(function (data) {
            $scope.email = undefined;
            $scope.form.$setPristine();
            $materialToast({
              template: 'Email envoyé avec succès, consultez votre boite mail.',
              duration: 4000,
              position: 'bottom right'
            });
          }).error(function (err) {
            $scope.error = err;
          });
      }
    }
  });
