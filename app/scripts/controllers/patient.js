'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, $http, $rootScope) {
    $scope.logout = function () {
      Auth.logout()
        .then(function () {
          $location.path('/');
        });
    };

    $scope.getBPDatas = function () {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      $http.get('/api/users/' + id + '/bp')
        .success(function (data) {
          $scope.BPDatas = data;
        })
        .error(function (data) {
          console.log(data);
        });
    };

    $scope.predicate = "-MDate";
    $scope.reverse = false;


    $scope.putBpDatainChart = function(BPList) {
       var DPChart = [['optimale', 0]];
       for(var i=0; i<BPList[0].length; i++) {
           if((BPList[0][i].HP < 120) && (BPList[0][i].HR < 80)) {
               DPChart[0][1] += 1;
           }
       }
        DPChart[0][1] /= BPList[0].length;
    };

    $scope.BPChart = $scope.putBpDatainChart($scope.BPDatas);

    $scope.exampleData = [
        {
            "key": "Series 1",
            "values": [ [ 10 , 0.5] , [ 25 , 8.5] , [ 20 , 6] , [ 12 , 0.5] , [ 16 , 8.5] , [ 28 , 6] ]
        }
    ];

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
