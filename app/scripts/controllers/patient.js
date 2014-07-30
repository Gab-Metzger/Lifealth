'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, PatientData, $materialSidenav) {
    $scope.patientInfos = {};
    PatientData.getInfos().then(function () {
      $scope.patientInfos = PatientData.infos;
    });

    $scope.logout = function () {
      Auth.logout()
        .then(function () {
          $location.path('/');
        });
    };

    $scope.BPDatas = [];
    $scope.BGDatas = [];
    $scope.BPClassified = [];
    $scope.BGClassified = [];

    $scope.predicate = "-MDate";
    $scope.reverse = false;
    $scope.minDateRange = moment().subtract('days', 180);
    $scope.maxDateRange = moment();
    $scope.defaultRange = {
      'depuis 7 jours': [moment().subtract('days', 7), moment()],
      'depuis 1 mois': [moment().subtract('days', 31), moment()],
      'depuis 3 mois': [moment().subtract('days', 93), moment()]
    };
    $scope.datesBP = {
      'startDate': moment().subtract('days', 7),
      'endDate': moment()
    };
    $scope.$watch('datesBP', function (value) {
      PatientData.getBPData(value.startDate, value.endDate)
        .then(function () {
          $scope.BPDatas = PatientData.bpData;
          $scope.BPClassified = PatientData.classifiedBpData;
        })
        .catch(function(err) {
          $scope.BPDatas = [];
          $scope.BPClassified = [];
          alert(err.ErrorDescription);
        });
    });

    $scope.datesBG = {
      'startDate': moment().subtract('days', 7),
      'endDate': moment()
    };
    $scope.$watch('datesBG', function (value) {
      PatientData.getBGData(value.startDate, value.endDate).then(function () {
        $scope.BGDatas = PatientData.bgData;
        $scope.BGClassified = PatientData.classifiedBgData;
      });
    });

    $scope.color = function () {
      return PatientData.colors;
    };

    $scope.bgColor = function (bp) {
      var color = PatientData.getColor(bp);
      return {
        'background-color': color,
        'color': 'white'
      };
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
        return d3.time.format('%x %X')(new Date(d * 1000));  //uncomment for date format
      }
    };

    $scope.toolTipContentFunction = function () {
      return function (key, x, y, e, graph) {
        return  'Informations' +
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
      return $scope.patientInfos.gender + ' - ' + $scope.patientInfos.age + ' ans'
    };
    $scope.goBack = function () {
      $location.path('/medecin');
    };
  });
