'use strict';

angular.module('lifealthApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $rootScope) {
    $scope.user = {
      email: $location.search().email
    };
    $scope.emailDisabled = false;
    $scope.errors = {};
    $scope.role = $rootScope.role;
    $scope.path = $rootScope.path;

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          lastName: $scope.user.lastName,
          firstName: $scope.user.firstName,
          gender: $scope.user.gender,
          dateofbirth: $scope.user.dateofbirth,
          email: $scope.user.email,
          password: $scope.user.password,
          role: $scope.role
        })
        .then( function() {
          // Account created, redirect
          $location.path($scope.path);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  });
