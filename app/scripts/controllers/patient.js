'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, PatientData, $materialSidenav) {
    $scope.selectedIndex = 0;
    $scope.patientInfos = {};
    PatientData.getInfos().then(function () {
      $scope.patientInfos = PatientData.infos;
    });

    $scope.logout = function () {
      Auth.logout()
        .then(function () {
          $location.path('/loginPatient');
        });
    };

    $scope.predicate = "-MDate";
    $scope.reverse = false;
    $scope.minDateRange = moment().subtract('days', 180);
    $scope.maxDateRange = moment();
    $scope.defaultRange = {
      'depuis 7 jours': [moment().subtract('days', 7), moment()],
      'depuis 1 mois': [moment().subtract('days', 31), moment()],
      'depuis 3 mois': [moment().subtract('days', 93), moment()]
    };

    $scope.color = function () {
      return PatientData.colors;
    };


    $scope.xAxisTickFormat = function () {
      return function (d) {
        return d;
      }
    };

    $scope.yAxisTickFormat = function () {
      return function (d) {
        return d + "%";
      }
    };

    $scope.xBGAxisTickFormat = function () {
      return function (d) {
        return moment(d, 'X').format('DD/MM HH:mm');  //uncomment for date format
      }
    };

    $scope.toolTipContentFunction = function () {
      return function (key, x, y, e, graph) {
        return 'Informations' +
        '<p>' + y + ' à ' + x + '</p>'
      }
    };

    $scope.openSideNavBar = function () {
      $materialSidenav('left').toggle();
    };

    $scope.goToMonitoring = function () {
      $materialSidenav('left').close();
    };

    $scope.patientName = function () {
      return $scope.patientInfos.firstName + ' ' + $scope.patientInfos.lastName;
    };

    $scope.patientAge = function () {
      var result = '';
      if ($scope.patientInfos.gender) {
        switch ($scope.patientInfos.gender) {
          case 'Male':
            result += 'Homme';
            break;
          case 'Female':
            result += 'Femme';
            break;
        }
      }
      if (result.length && $scope.patientInfos.age) {
        result += ' - ';
      }
      if ($scope.patientInfos.age) {
        result += $scope.patientInfos.age + ' ans'
      }
      return result;
    };

    $scope.goBack = function () {
      $location.path('/medecin');
    };


  });
