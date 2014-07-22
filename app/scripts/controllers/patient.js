'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, PatientData) {
    $scope.logout = function () {
      Auth.logout()
        .then(function () {
          $location.path('/');
        });
    };

    $scope.BPDatas = PatientData.bpData;
    $scope.BPClassified = PatientData.classifiedBpData;
    PatientData.getBPData().then(function() {
      $scope.BPDatas = PatientData.bpData;
      $scope.BPClassified = PatientData.classifiedBpData;
    });

    $scope.predicate = "-MDate";
    $scope.reverse = false;

    $scope.color = function() {
        return ['red', 'blue', 'green', 'gray', 'yellow', 'black'];
    }

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
  });
