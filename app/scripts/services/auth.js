'use strict';

angular.module('lifealthApp')
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {

    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {

      /**
       * Authenticate user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;

        return Session.save({
          email: user.email,
          password: user.password,
          role: user.role
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Unauthenticate user
       *
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      logout: function(callback) {
        var cb = callback || angular.noop;

        return Session.delete(function() {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
       * Update user
       *
       * @param  {Object}   user
       * @return {Promise}
       */
      updateUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.update(user, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      currentUser: function() {
        return User.get();
      },

      /**
       * Simple check to see if a user is logged in
       *
       * @return {Boolean}
       */
      isPatientLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user && user.role == 'PATIENT';
      },

      isDoctorLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user && user.role == 'DOCTOR';
      }
    };
  });
