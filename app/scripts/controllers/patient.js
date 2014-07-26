'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, PatientData, $materialSidenav) {
    $scope.patientInfos = PatientData.infos;
    PatientData.getInfos().then(function() {
      $scope.patientInfos = PatientData.infos;
    });

    $scope.logout = function () {
      Auth.logout()
        .then(function () {
          $location.path('/');
        });
    };

    $scope.BPDatas = PatientData.bpData;
    $scope.BPClassified = PatientData.classifiedBpData;

    $scope.predicate = "-MDate";
    $scope.reverse = false;
    $scope.minDateRange = moment().subtract('days', 300).format('YYYY-MM-DD');
    $scope.maxDateRange = moment().format('YYYY-MM-DD');
    $scope.defaultRange = {
      'Special Range': {
        'startDate': moment().subtract('days', 7).format('YYYY-MM-DD'),
        'endDate': moment().format('YYYY-MM-DD')
      }
    };
    $scope.dates = {
        'startDate': moment().subtract('days', 7),
        'endDate': moment()
    };
    $scope.$watch('dates', function(value) {
      PatientData.getBPData(value.startDate, value.endDate).then(function() {
        $scope.BPDatas = PatientData.bpData;
        $scope.BPClassified = PatientData.classifiedBpData;
      });
    });

    $scope.color = function() {
        return PatientData.colors;
    };

    $scope.bgColor = function (bp) {
      var color = PatientData.getColor(bp);
      return {
        'background-color': color,
        'color': 'white'
      };
    };

    $scope.xAxisTickFormat = function(){
        return function(d){
            return d;
        }
    };

    $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
            return  'Informations' +
                '<p>' +  y + ' à ' + x + '</p>'
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
    $scope.patientAge = function() {
      return $scope.patientInfos.gender + ' - ' + $scope.patientInfos.age + ' ans'
    }
  });
