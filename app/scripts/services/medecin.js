'use strict';

angular.module('lifealthApp')
  .factory('MedecinData', function ($rootScope, $http) {

      return $http.get('/api/doctors/' + $rootScope.currentUser.id + '/records')
        .error(function (data) {
          console.log(data);
        });
  });
