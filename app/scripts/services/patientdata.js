'use strict';

angular.module('lifealthApp')
  .factory('PatientData', function ($rootScope, $http) {

    var PatientData = {};

    var getClassification = function (bp) {
      var result = 0;
      if ((bp.HP <= 120) && (bp.LP <= 80)) {
        result = 0;
      }
      if ((bp.HP >= 120 && bp.HP <= 129) || (bp.LP >= 80 && bp.LP <= 84)) {
        result = 1;
      }
      if ((bp.HP >= 130 && bp.HP <= 139) || (bp.LP >= 85 && bp.LP <= 89)) {
        result = 2;
      }
      if ((bp.HP >= 140 && bp.HP <= 159) || (bp.LP >= 90 && bp.LP <= 99)) {
        result = 3;
      }
      if ((bp.HP >= 160 && bp.HP <= 179) || (bp.LP >= 100 && bp.LP <= 109)) {
        result = 4;
      }
      if ((bp.HP >= 180) || (bp.LP >= 110)) {
        result = 5;
      }
      return result;
    };

    var pagination = 6;
    var originalBpData = [];
    var originalBgData = [];
    var momentFilter = null;

    PatientData.getColor = function (bp) {
      return PatientData.colors[getClassification(bp)];
    };

    var resetBp = function () {
      PatientData.bpLength = 0;
      PatientData.bpData = [];
      PatientData.classifiedBpData = [];
    }
    var resetBg = function () {
      PatientData.bgLength = 0;
      PatientData.bgData = [];
      PatientData.classifiedBgData = [];
      PatientData.hba1c = '';
    }

    PatientData.momentFilterBg = function (moment) {
      if (moment == '') {
        return paginate(originalBgData);
      }
      return paginate(filterBgBy(moment));
    }

    function filterBgBy(moment) {
      if (moment != '') {
        var res = [];
        for (var i = 0; i < originalBgData.length; i++) {
          if (originalBgData[i].DinnerSituation === moment) {
            res.push(originalBgData[i]);
          }
        }
        return res;
      }
    }

    PatientData.colors = ['rgb(1, 145, 60)', 'rgb(142, 194, 31)', 'rgb(255, 240, 2)', 'rgb(241, 150, 0)', 'rgb(233, 86, 19)', 'rgb(229, 1, 18)'];

    PatientData.getBPData = function (from, to) {
      var id = getID();
      if (id) {
        return $http.get('/api/users/' + id + '/bp?from=' + from.unix() + '&to=' + to.unix())
          .success(function (data) {
            originalBpData = data;

            if (data.length) {
              //Change date format
              for (var i = 0; i < data.length; i++) {
                data[i].MDate = moment.utc(data[i].MDate, 'X').format('DD/MM HH:mm');
              }
              PatientData.bpLength = data.length;
              // pagination
              PatientData.bpData = paginate(data);

              // classification
              var classified = [
                ['Optimale', 0],
                ['Normale', 0],
                ['Normale Haute', 0],
                ['HTA grade 1', 0],
                ['HTA grade 2', 0],
                ['HTA grade 3', 0]
              ];
              for (var i = 0; i < data.length; i++) {
                classified[getClassification(data[i])][1]++;
              }
              for (var i = 0; i < classified.length; i++) {
                classified[i][1] = (classified[i][1] / data.length) * 100;
                classified[i][1] = Math.round(classified[i][1] * 10) / 10;
              }
              PatientData.classifiedBpData = [
                {
                  key: 'Pression artérielle - vue statistique sur la période',
                  values: classified
                }
              ];
            } else {
              resetBp();
            }
          })
          .error(function (data) {
            resetBp();
            console.log(data);
          });
      } else {
        resetBp();
      }
    };

    PatientData.getHTAValues = function (classifiedArray) {
      var res = [];

      for (var i = 0; i < 3; i++) {
        res.push(classifiedArray[i + 3][1]);
      }
      var sum = (res[0] + res[1] + res[2]);
      res.push(sum);

      return res;
    }

    PatientData.getBpSmiley = function (htaArray) {
      var smiley = {
        img: '',
        texte: ''
      };

      if ((htaArray[0] > 30.0 || htaArray[1] > 30.0 || htaArray[2] > 30.0) || htaArray[3] > 30.0) {
        smiley.img = ':(';
        smiley.texte = 'Attention ! Votre tension artérielle est très élevée, veuillez consulter votre medecin';
      }
      else if ((htaArray[0] > 15.0 || htaArray[1] > 15.0 || htaArray[2] > 15.0) || htaArray[3] > 15.0) {
        smiley.img = ':)';
        smiley.texte = 'Votre tension artérielle est presque bonne, continuez vos mesures !';
      }
      else {
        smiley.img = ':D';
        smiley.texte = 'Bravo ! Votre tension artérielle est correcte';
      }

      return smiley;
    }

    function getID() {
      if ($rootScope.currentUser) {
        var id = $rootScope.currentUser.id;
        if ($rootScope.currentUser.role == 'DOCTOR') {
          id = $rootScope.currentUser.selectedPatientId;
        }
        return id;
      }
    }

    PatientData.updateBpData = function (bp) {
      var id = getID();
      if (id) {
        bp.MDate = moment.utc(bp.MDate, 'DD/MM HH:mm').unix();
        return $http.post('/api/users/' + id + '/bp', bp).success(function (data) {
          bp.MDate = moment.utc(bp.MDate, 'X').format('DD/MM HH:mm');
          bp._id = data;
        });
      }
    };

    PatientData.removeBpData = function (bp) {
      var id = getID();
      if (id) {
        return $http.delete('/api/users/' + id + '/bp/' + bp._id);
      }
    };

    PatientData.resetBpData = function (bp) {
      var id = getID();
      if (id) {
        return $http.get('/api/users/' + id + '/bp/' + bp._id).success(function (data) {
          data.MDate = moment.utc(data.MDate, 'X').format('DD/MM HH:mm');
          angular.copy(data, bp);
        });
      }
    };

    var paginate = function (data) {
      if (data.length > pagination) {
        var finalList = [];
        for (var i = 0; i < Math.floor(data.length / pagination) + 1; i++) {
          finalList.push(data.slice(i * pagination, (i + 1) * pagination));
        }
        return finalList;
      } else {
        return [data];
      }
    };

    var hba1cArray = [
      [[126, 128], 6.0], [[128, 131], 6.1], [[131, 134], 6.2], [[134, 137], 6.3],
      [[137, 140], 6.4], [[140, 143], 6.5], [[143, 146], 6.6], [[146, 148], 6.7],
      [[148, 151], 6.8], [[151, 154], 6.9], [[154, 157], 7.0], [[157, 160], 7.1],
      [[160, 163], 7.2], [[163, 166], 7.3], [[166, 169], 7.4], [[169, 171], 7.5],
      [[171, 174], 7.6], [[174, 177], 7.7], [[177, 180], 7.8], [[180, 183], 7.9],
      [[183, 186], 8.0], [[186, 189], 8.1], [[189, 192], 8.2], [[192, 194], 8.3],
      [[194, 197], 8.4], [[197, 200], 8.5], [[200, 203], 8.6], [[203, 206], 8.7],
      [[206, 209], 8.8], [[209, 212], 8.9], [[212, 214], 9.0], [[214, 217], 9.1],
      [[217, 220], 9.2], [[220, 223], 9.3], [[223, 226], 9.4], [[226, 229], 9.5],
      [[229, 232], 9.6], [[232, 235], 9.7], [[235, 237], 9.8], [[237, 240], 9.9],
      [[240, 243], 10.0]
    ];

    var calculHba1c = function (value, n) {
      if ((n < 0) || (n >= hba1cArray.length)) {
        if (value < hba1cArray[0][0][0]) {
          return 'inférieur à 6.0%';
        }
        else {
          return 'supérieur à 10.0%';
        }

      }
      else if ((value >= hba1cArray[n][0][0]) && (value < hba1cArray[n][0][1])) {
        return hba1cArray[n][1] + '%';
      }
      else {
        return calculHba1c(value, n + 1);
      }
    };

    PatientData.MOMENTS = {
      'Before_breakfast': 'A jeun',
      'After_breakfast': 'Après petit-déjeuner',
      'Before_lunch': 'Avant repas du midi',
      'After_lunch': 'Après repas du midi',
      'Before_dinner': 'Avant repas du soir',
      'After_dinner': 'Après repas du soir'
    };
    PatientData.MOMENTS2 = [
      {value: 'Before_breakfast', label: 'A jeun', order: 1},
      {value: 'After_breakfast', label: 'Après petit-déjeuner', order: 2},
      {value: 'Before_lunch', label: 'Avant repas du midi', order: 3},
      {value: 'After_lunch', label: 'Après repas du midi', order: 4},
      {value: 'Before_dinner', label: 'Avant repas du soir', order: 5},
      {value: 'After_dinner', label: 'Après repas du soir', order: 6}
    ];

    PatientData.getBGData = function (from, to, momentFilter) {
      var id = getID();
      if (id) {
        return $http.get('/api/users/' + id + '/bg?from=' + from.unix() + '&to=' + to.unix())
          .success(function (data) {
            originalBgData = data;
            if (originalBgData.length) {
              PatientData.bgLength = data.length;
              //Chart array
              var chartArray = [];

              PatientData.classifiedBgData = [
                {
                  key: 'Glycémie capillaire (mg/dl)',
                  values: chartArray
                }
              ];
              var sumBG = 0;
              for (var i = 0; i < data.length; i++) {
                chartArray[i] = [data[i].MDate, data[i].BG];
                sumBG += data[i].BG;
                data[i].MDate = moment.utc(data[i].MDate, 'X').format('DD/MM HH:mm');
                //data[i].DinnerSituation = PatientData.MOMENTS[data[i].DinnerSituation];
              }
              //hba1c calcul
              PatientData.averageBG = sumBG / data.length;
              PatientData.hba1c = calculHba1c(PatientData.averageBG, 0);
              // moment filter
              if (momentFilter && (momentFilter !== 'Aucun')) {
                PatientData.bgData = paginate(filterBgBy(momentFilter));
              } else {
                // pagination
                PatientData.bgData = paginate(data);
              }

            } else {
              resetBg();
            }
          })
          .error(function (data) {
            resetBg();
            console.log(data);
          });
      } else {
        resetBg();
      }
    };

    PatientData.updateBgData = function (bg) {
      var id = getID();
      if (id) {
        bg.MDate = moment.utc(bg.MDate, 'DD/MM HH:mm').unix();
        return $http.post('/api/users/' + id + '/bg', bg).success(function (data) {
          bg.MDate = moment.utc(bg.MDate, 'X').format('DD/MM HH:mm');
          bg._id = data;
        });
      }
    };

    PatientData.removeBgData = function (bg) {
      var id = getID();
      if (id) {
        return $http.delete('/api/users/' + id + '/bg/' + bg._id);
      }
    };

    PatientData.resetBgData = function (bg) {
      var id = getID();
      if (id) {
        return $http.get('/api/users/' + id + '/bg/' + bg._id).success(function (data) {
          data.MDate = moment.utc(data.MDate, 'X').format('DD/MM HH:mm');
          angular.copy(data, bg);
        });
      }
    };

    PatientData.infos = {};

    PatientData.getInfos = function () {
      var id = getID();
      if (id) {
        return $http.get('/api/users/' + id)
          .success(function (data) {
            PatientData.infos = data.profile;
          })
          .error(function (data) {
            PatientData.infos = {};
            console.log(data);
          });
      } else {
        PatientData.infos = {};
      }
    };

    PatientData.unlink = function(provider) {
      return $http.get('/api/users/'+$rootScope.currentUser.id+'/unlink');
    };

    PatientData.getDoctors = function() {
      return $http.get('/api/users/'+$rootScope.currentUser.id+'/doctors');
    }

    return PatientData;
  });
