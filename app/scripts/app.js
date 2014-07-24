'use strict';

angular.module('lifealthApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngMaterial',
    'nvd3ChartDirectives',
    'ngBootstrap'
  ])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main'
      })
      .when('/medecin', {
        templateUrl: 'partials/medecin',
        controller: 'MedecinCtrl',
        authenticate: true
      })
      .when('/loginDoctor', {
        templateUrl: 'partials/loginDoctor',
        controller: 'LoginCtrl'
      })
      .when('/loginPatient', {
        templateUrl: 'partials/loginPatient',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/patient', {
        templateUrl: 'partials/patient',
        controller: 'PatientCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });

    //$locationProvider.html5Mode(true);

    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
      return {
        'responseError': function (response) {
          if (response.status === 401) {
            $location.path('/loginDoctor');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (next.authenticate) {
        if (next.originalPath == '/patient') {
          if (Auth.isDoctorLoggedIn() && !$rootScope.currentUser.selectedPatientId) {
            $location.path('/medecin');
          } else if (!Auth.isDoctorLoggedIn() && !Auth.isPatientLoggedIn()) {
            $location.path('/loginPatient');
          }
        } else if (next.originalPath == '/medecin' && !Auth.isDoctorLoggedIn()) {
          $location.path('/loginDoctor')
        }
      }
    });
  });
