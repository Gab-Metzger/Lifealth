'use strict';

angular.module('lifealthApp')
  .controller('MedecinCtrl', function ($scope, Auth, $location, $http, $rootScope) {
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };
    $scope.recordName;
    $scope.email;
    $scope.addRecord = function () {
      $http.post('/api/doctors/'+$rootScope.currentUser.id+'/records', {'email': $scope.email})
        .success(function(data) {
          console.log(data);
          // TODO something
        })
        .error(function(data) {
          console.log(data);
        });
    };
    $http.get('/api/doctors/'+$rootScope.currentUser.id+'/records')
      .success(function(data) {
        $scope.foundRecords = data;
      });
    $scope.deleteRecord = function (r) {
      $http.delete('/api/doctors/'+$rootScope.currentUser.id+'/records/'+ r._id)
        .success(function(data) {
          $scope.foundRecords.splice($scope.foundRecords.indexOf(r), 1);
        })
    };
    $scope.goToRecord = function (r) {

    };
  });
