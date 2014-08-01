'use strict';

angular.module('lifealthApp')
  .factory('PatientData', function PatientData($rootScope, $http) {

    var getClassification = function (bp) {
      var result = 0;
      if ((bp.HP <= 120) && (bp.LP <= 80)) {
        result = 0;
      }
      if ((bp.HP > 120 && bp.HP < 129) || (bp.LP > 80 && bp.LP < 84)) {
        result = 1;
      }
      if ((bp.HP > 130 && bp.HP < 139) || (bp.LP > 85 && bp.LP < 89)) {
        result = 2;
      }
      if ((bp.HP > 140 && bp.HP < 159) || (bp.LP > 90 && bp.LP < 99)) {
        result = 3;
      }
      if ((bp.HP > 160 && bp.HP < 179) || (bp.LP > 100 && bp.LP < 109)) {
        result = 4;
      }
      if ((bp.HP >= 180) || (bp.LP >= 110)) {
        result = 5;
      }
      return result;
    };

    var pagination = 6;

    PatientData.getColor = function (bp) {
      return PatientData.colors[getClassification(bp)];
    };

    PatientData.bpLength = 0;
    PatientData.bpData = [];
    PatientData.bgLength = 0;
    PatientData.bgData = [];

    PatientData.colors = ['rgb(1, 145, 60)', 'rgb(142, 194, 31)', 'rgb(255, 240, 2)', 'rgb(241, 150, 0)', 'rgb(233, 86, 19)', 'rgb(229, 1, 18)'];

    PatientData.getBPData = function (from, to) {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      if (id) {
        return $http.get('/api/users/' + id + '/bp?from=' + from.unix() + '&to=' + to.unix())
          .success(function (data) {

            if (data.length) {
              //Change date format
              for (var i = 0; i < data.length; i++) {
                data[i].MDate = moment.utc(data[i].MDate, 'X').format('DD/MM HH:mm');
              }
              PatientData.bpLength = data.length;
              // pagination
              if (data.length > pagination) {
                var finalList = [];
                for (var i = 0; i < Math.floor(data.length / pagination) + 1; i++) {
                  finalList.push(data.slice(i * pagination, (i + 1) * pagination));
                }
                PatientData.bpData = finalList;
              } else {
                PatientData.bpData = [data];
              }

              // classification
              var classified = [
                ['Optimale', 0],
                ['Normale', 0],
                ['Normale Haute', 0],
                ['Hypertension moyenne', 0],
                ['Hypertension modérée', 0],
                ['Hypertension sévère', 0]
              ];
              for (var i = 0; i < data.length; i++) {
                classified[getClassification(data[i])][1]++;
              }
              for (var i = 0; i < classified.length; i++) {
                classified[i][1] = (classified[i][1] / data.length) * 100;
                classified[i][1] = Math.round(classified[i][1]*10)/10;
              }
              PatientData.classifiedBpData = [
                {
                  key: 'Préssion artérielle - vue statistique sur la période',
                  values: classified
                }
              ];
            } else {
              PatientData.bpLength = 0;
              PatientData.bpData = [];
              PatientData.classifiedBpData = [];
            }
          })
          .error(function (data) {
            console.log(data);
          });
      }
    };

    PatientData.getBGData = function (from, to) {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      return $http.get('/api/users/' + id + '/bg?from=' + from.unix() + '&to=' + to.unix())
        .success(function (data) {
          PatientData.bgLength = 0;
          //Chart array
          var chartArray = [];

          PatientData.classifiedBgData = [
            {
              key: 'Glycémie capillaire (mg/dl)',
              values: chartArray
            }
          ];
          PatientData.bgData = [data];
          for (var i = 0; i < data.length; i++) {
            chartArray[i] = [data[i].MDate, data[i].BG];
            PatientData.bgData[0][i].MDate = moment.utc(PatientData.bgData[0][i].MDate, 'X').format('DD/MM HH:mm');
          }
        })
        .error(function (data) {
          console.log(data);
        });
    };

    PatientData.infos = {};

    PatientData.getInfos = function () {
      var id = $rootScope.currentUser.id;
      if ($rootScope.currentUser.role == 'DOCTOR') {
        id = $rootScope.currentUser.selectedPatientId;
      }
      if (id) {
        return $http.get('/api/users/' + id)
          .success(function (data) {
            PatientData.infos = data.profile;
          })
          .error(function (data) {
            console.log(data);
          });
      }
    };

    return PatientData;
  });
