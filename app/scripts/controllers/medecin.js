'use strict';

angular.module('lifealthApp')
  .controller('MedecinCtrl', function ($scope, Auth, $location, $http, $rootScope, $materialSidenav) {
    $
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };
    $scope.recordName;
    $scope.email;
    $scope.firstName;
    $scope.lastName;
    $scope.addRecord = function () {
      $http.post('/api/doctors/'+$rootScope.currentUser.id+'/records', {'email': $scope.email, 'firstName': $scope.firstName, 'lastName': $scope.lastName})
        .success(function(data) {
          $rootScope.currentUser.selectedPatientId = data._id;
          $location.path('/patient');
        })
        .error(function(data) {
          console.log(data);
        });
    };
    $scope.name = function (r) {
      return r.firstName+' '+ r.lastName;
    };
    $http.get('/api/doctors/'+$rootScope.currentUser.id+'/records')
      .success(function(data) {
        $scope.foundRecords = data;
      });
    $scope.deleteRecord = function (r) {
      if (confirm('Etes-vous sûr de vouloir supprimer ce dossier ?')) {
        $http.delete('/api/doctors/'+$rootScope.currentUser.id+'/records/'+ r._id)
          .success(function(data) {
            $scope.foundRecords.splice($scope.foundRecords.indexOf(r), 1);
          });
      }
    };
    $scope.goToRecord = function (r) {
      $rootScope.currentUser.selectedPatientId = r._id;
      $location.path('/patient');
    };

    $scope.openSideNavBar = function () {
      $materialSidenav('left').toggle();
    };

    $scope.goToMonitoring = function () {
      $materialSidenav('left').close();
    };
  });
