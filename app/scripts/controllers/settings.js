'use strict'

angular.module('lifealthApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $location, $http, User, Auth, PatientData) {
    $scope.user = $rootScope.currentUser;
    $scope.role = $scope.user.role;
    $scope.emailDisabled = true;
    $scope.errors = {};

    $scope.unlink = function (provider) {
        PatientData.unlink(provider).then(function() {
          $rootScope.currentUser.provider = null;
        });
    };

    $scope.fetchDoctors = function() {
      return PatientData.getDoctors().success(function(data) {
        $scope.doctors = data;
      });
    };

    $scope.deleteDoctor = function (d) {
      if (confirm('Etes-vous sûr de vouloir supprimer '+ d.firstName +' '+ d.lastName +' ?')) {
        $http.delete('/api/users/'+$rootScope.currentUser.id+'/doctors/'+ d._id)
          .success(function(data) {
            $scope.doctors.splice($scope.doctors.indexOf(d), 1);
          });
      }
    };

    $scope.update = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.updateUser({
          lastName: $scope.user.lastName,
          firstName: $scope.user.firstName,
          gender: $scope.user.gender,
          dateofbirth: $scope.user.dateofbirth,
          email: $scope.user.email,
          oldPassword: $scope.user.password,
          newPassword: $scope.user.newPassword
        })
          .then( function() {
            // TODO : toast
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
