'use strict';

angular.module('lifealthApp')
  .factory('PatientData', function PatientData($rootScope, $http) {

    PatientData.bpData = [];

    PatientData.getBPData = function () {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      return $http.get('/api/users/' + id + '/bp')
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
            if ((data[0][i].HP < 120) && (data[0][i].LP < 80)) {
              classified[0][1]++;
            }
            if ((data[0][i].HP > 120 && data[0][i].HP < 129) || (data[0][i].LP > 80 && data[0][i].LP < 84)) {
              classified[1][1]++;
            }
            if ((data[0][i].HP > 130 && data[0][i].HP < 139) || (data[0][i].LP > 85&& data[0][i].LP < 89)) {
              classified[2][1]++;
            }
            if ((data[0][i].HP > 140 && data[0][i].HP < 159) || (data[0][i].LP > 90 && data[0][i].LP < 99)) {
              classified[3][1]++;
            }
            if ((data[0][i].HP > 160 && data[0][i].HP < 179) || (data[0][i].LP > 100 && data[0][i].LP < 109)) {
              classified[4][1]++;
            }
            if ((data[0][i].HP >= 180) || (data[0][i].LP >= 110)) {
              classified[5][1]++;
            }
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
