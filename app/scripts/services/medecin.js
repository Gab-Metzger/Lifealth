'use strict';

angular.module('lifealthApp')
  .service('MedecinData',function($rootScope,$http) {

    this.getRecords = function() {
      $http.get('/api/doctors/'+$rootScope.currentUser.id+'/records')
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        });
    };
  });
