'use strict';

angular.module('lifealthApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
