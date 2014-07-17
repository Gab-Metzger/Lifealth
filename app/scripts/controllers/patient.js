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
                $scope.BPDatas = data;
            })
            .error(function(data) {
                console.log(data);
        });
    }

        $scope.predicate = "-MDate";
        $scope.reverse = false;
  });
