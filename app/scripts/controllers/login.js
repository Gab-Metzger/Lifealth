'use strict';

angular.module('lifealthApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $rootScope) {
    $scope.user = {
      email: $location.search().email
    };
    $scope.errors = {};

    $scope.$on('$locationChangeSuccess', function(event, toUrl, fromUrl) {
      if (toUrl.indexOf('signup') != -1) {
        if (fromUrl.indexOf('loginPatient') != -1) {
          $rootScope.role = 'PATIENT';
          $rootScope.path = '/patient';
        } else if (fromUrl.indexOf('loginDoctor') != -1) {
          $rootScope.role = 'DOCTOR';
          $rootScope.path = '/medecin';
        }
      }
    });

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

    $scope.signupUrl = function () {
      if ($scope.user.email) {
        return '/#/signup?email='+$scope.user.email;
      }
      return '/#/signup';
    };

  });
