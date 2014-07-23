'use strict';

angular.module('lifealthApp')
  .factory('PatientData', function PatientData($rootScope, $http) {

    var getClassification = function(bp) {
      if ((bp.HP < 120) && (bp.LP < 80)) {
        return 0;
      }
      if ((bp.HP > 120 && bp.HP < 129) || (bp.LP > 80 && bp.LP < 84)) {
        return 1;
      }
      if ((bp.HP > 130 && bp.HP < 139) || (bp.LP > 85&& bp.LP < 89)) {
        return 2;
      }
      if ((bp.HP > 140 && bp.HP < 159) || (bp.LP > 90 && bp.LP < 99)) {
        return 3;
      }
      if ((bp.HP > 160 && bp.HP < 179) || (bp.LP > 100 && bp.LP < 109)) {
        return 4;
      }
      if ((bp.HP >= 180) || (bp.LP >= 110)) {
        return 5;
      }
    };

    PatientData.getColor = function(bp) {
      return PatientData.colors[getClassification(bp)];
    };

    PatientData.bpData = [];

    PatientData.colors = ['rgb(1, 145, 60)', 'rgb(142, 194, 31)', 'rgb(255, 240, 2)', 'rgb(241, 150, 0)', 'rgb(233, 86, 19)', 'rgb(229, 1, 18)'];

    PatientData.getBPData = function (from, to) {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      return $http.get('/api/users/' + id + '/bp?from='+from.unix()+'&to='+to.unix())
        .success(function (data) {
          // classification
          var classified = [
            ['Optimale', 0],
            ['Normale', 0],
            ['Normale Haute', 0],
            ['Hypertension moyenne', 0],
            ['Hypertension modérée', 0],
            ['Hypertension sévère', 0]
          ];
          for (var i = 0; i < data[0].length; i++) {
            classified[getClassification(data[0][i])][1]++;
          }
          PatientData.classifiedBpData = [
            {
              key: 'Classification',
              values: classified
            }
          ];

          PatientData.bpData = data;
        })
        .error(function (data) {
          console.log(data);
        });
    };
    return PatientData;
  });
