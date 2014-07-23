'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, PatientData, $materialSidenav) {
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
      console.log(value);
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
  });
