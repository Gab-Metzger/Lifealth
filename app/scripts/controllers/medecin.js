'use strict';

angular.module('lifealthApp')
  .controller('MedecinCtrl', function ($scope, Auth, $location, records, invites, $http, $rootScope, $materialSidenav, $materialToast) {

    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/loginDoctor');
        });
    };
    $scope.recordName;
    $scope.email;
    $scope.firstName;
    $scope.lastName;
    $scope.notes;
    $scope.addRecord = function () {
      $http.post('/api/doctors/'+$rootScope.currentUser.id+'/records', {'email': $scope.email, 'firstName': $scope.firstName, 'lastName': $scope.lastName, 'notes': $scope.notes})
        .success(function(data) {
          $rootScope.currentUser.selectedPatientId = data._id;
          $scope.lastName = undefined;
          $scope.firstName = undefined;
          $scope.email = undefined;
          $scope.notes = undefined;
          $scope.form.$setPristine();
          $materialToast({
            template: 'Invitation envoyée avec succès',
            duration: 2000,
            position: 'bottom right'
          });
        })
        .error(function(data) {
          console.log(data);
        });
    };

    $scope.name = function (r) {
      return r.firstName+' '+ r.lastName;
    };

    $scope.foundRecords = records.data;
    $scope.invites = invites.data;

    $scope.deleteRecord = function (r) {
      if (confirm('Etes-vous sûr de vouloir supprimer ce patient ?')) {
        $http.delete('/api/doctors/'+$rootScope.currentUser.id+'/records/'+ r._id)
          .success(function(data) {
            $scope.foundRecords.splice($scope.foundRecords.indexOf(r), 1);
          });
      }
    };
    $scope.deleteInvite = function (u) {
      if (confirm('Etes-vous sûr de vouloir supprimer cette invitation ?')) {
        $http.delete('/api/doctors/'+$rootScope.currentUser.id+'/invites/'+ u._id)
          .success(function(data) {
            $scope.invites.splice($scope.invites.indexOf(u), 1);
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
