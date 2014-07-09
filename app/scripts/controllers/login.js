'use strict';

angular.module('lifealthApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password,
          role: ($location.path() == '/loginDoctor')?'DOCTOR':'PATIENT'
        })
        .then( function(user) {
          // Logged in, redirect to home
          if (user.role === 'DOCTOR') {
            $location.path('/medecin');
          } else if (user.role === 'PATIENT') {
            $location.path('/patient');
          }
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };

  });
