'use strict';

angular.module('lifealthApp')
  .controller('PatientCtrl', function ($scope, Auth, $location, $http, $rootScope) {
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
        });
    };

    $scope.getBPDatas = function() {
        $http.get('/api/users/'+$rootScope.currentUser.id+'/bp')
            .success(function(data) {
                $scope.BPDatas = data;
            })
            .error(function(data) {
                console.log(data);
        });
    };

    $scope.predicate = "-MDate";
    $scope.reverse = false;

    /*
    $scope.putBpDatainChart = function(BPList) {
       var DPChart = [['optimale', 0]];
       for(var i=0; i<BPList[0].length; i++) {
           if(BPList[0][i].HP < 120 && BPList[0][i].HR < 80) {
               DPChart[0][1] += 1;
           }
           ... Suite des if pour les autres cas
       }
        DPChart[0][1] /= BPList[0].length;
        .. pareil pour les autres cas
    };

    $scope.BPChart = $scope.putBpDatainChart($scope.BPDatas);
    */
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
