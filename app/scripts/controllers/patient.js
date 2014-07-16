'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, $http, $rootScope) {
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };

    $scope.getBPDatas = function() {
        $http.get('/api/users/'+$rootScope.currentUser.id+'/bp')
            .success(function(data) {
                console.log(data);
                // TODO something
            })
            .error(function(data) {
                console.log(data);
        });
    }
  });
