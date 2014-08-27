'use strict';

angular.module('lifealthApp')
  .factory('MedecinData', function ($rootScope, $http) {

    var MedecinData = {};

    MedecinData.records = function () {
      if ($rootScope.currentUser) {
        return $http.get('/api/doctors/' + $rootScope.currentUser.id + '/records')
          .error(function (data) {
            console.log(data);
          });
      }
    }
    MedecinData.invites = function () {
      if ($rootScope.currentUser) {
        return $http.get('/api/doctors/' + $rootScope.currentUser.id + '/invites')
          .error(function (data) {
            console.log(data);
          });
      }
    }

    return MedecinData;
  });
