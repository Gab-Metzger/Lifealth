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
          $location.path('/loginPatient');
        });
    };

    $scope.BPDatas = [];
    $scope.BGDatas = [];
    $scope.BPClassified = [];
    $scope.BGClassified = [];
    $scope.momentBG = 'Aucun';

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
      $scope.bpIndex = 0;
      $scope.BPDatas = [];
      $scope.BPClassified = [];
      $scope.searchingBp = true;
      PatientData.getBPData(value.startDate, value.endDate)
        .then(function () {
          $scope.BPDatas = PatientData.bpData;
          $scope.BPClassified = PatientData.classifiedBpData;
          $scope.searchingBp = false;
        })
        .catch(function (err) {
          $scope.bpIndex = 0;
          $scope.BPDatas = [];
          $scope.BPClassified = [];
          $scope.searchingBp = false;
        });
    });

    $scope.datesBG = {
      'startDate': moment().subtract('days', 7),
      'endDate': moment()
    };
    $scope.$watch('datesBG', function (value) {
      $scope.BGDatas = [];
      $scope.BGClassified = [];
      $scope.hba1c = '';
      $scope.searchingBg = true;
      PatientData.getBGData(value.startDate, value.endDate, $scope.momentBG).then(function () {
        $scope.BGDatas = PatientData.bgData;
        $scope.BGClassified = PatientData.classifiedBgData;
        $scope.hba1c = PatientData.hba1c;
        $scope.searchingBg = false;
      }).catch(function () {
        $scope.BGDatas = [];
        $scope.BGClassified = [];
        $scope.hba1c = '';
        $scope.searchingBg = false;
      });
    });

    $scope.filter = function () {
      $scope.BGDatas = PatientData.momentFilterBg($scope.momentBG);
    };

    $scope.getBPDataLength = function () {
      if (PatientData.bpLength == 0) {
        return 'aucune mesure trouvée';
      }
      return PatientData.bpLength + ' mesure' + ((PatientData.bpLength > 1) ? 's' : '');
    };

    $scope.addBPData = function () {
      if ($scope.BPDatas.length == 0) {
        $scope.BPDatas[0] = [];
      }
      $scope.BPDatas[0].unshift({
        MDate: moment.utc().format('DD/MM HH:mm'),
        manual: true,
        edit: false
      });
    };

    $scope.validBPData = function (bp) {
      PatientData.updateBpData(bp).then(function() {
        bp.manual = undefined;
        bp.edit = true;
      }).catch(function(err) {
        console.log('valid BP data error : '+err);
      });
    };
    $scope.cancelBPData = function (bp) {
      if (bp._id) {
        bp.manual = undefined;
        bp.edit = true;
      } else {
        $scope.BPDatas[0].splice($scope.BPDatas[0].indexOf(bp), 1);
      }
    };
    $scope.editBPData = function (bp) {
      bp.manual = true;
      bp.edit = false;
    };
    $scope.removeBPData = function (bp) {
      PatientData.removeBpData(bp).then(function() {
        $scope.BPDatas[0].splice($scope.BPDatas[0].indexOf(bp), 1);
      }).catch(function(err) {
        console.log('remove BP data error : ' +err);
      });
    };

    $scope.getBGDataLength = function () {
      if (PatientData.bgLength == 0) {
        return 'aucune mesure trouvée';
      }
      return PatientData.bgLength + ' mesure' + ((PatientData.bgLength > 1) ? 's' : '');
    };

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

    $scope.momentColor = function (bg) {
      var backgroundColor = 'black';
      if (bg.DinnerSituation === 'A jeun' || bg.DinnerSituation === 'Avant repas du midi' || bg.DinnerSituation === 'Avant repas du soir') {
        if (bg.BG <= 70) {
          backgroundColor = 'rgb(142, 194, 31)';
        }
        else if (bg.BG > 70 && bg.BG <= 110) {
          backgroundColor = 'rgb(1, 145, 60)';
        }
        else if (bg.BG > 110 && bg.BG <= 120) {
          backgroundColor = 'rgb(241, 150, 0)';
        }
        else if (bg.BG > 120) {
          backgroundColor = 'rgb(229, 1, 18)';
        }
      }
      else if (bg.DinnerSituation === 'Après petit-déjeuner' || bg.DinnerSituation === 'Après repas du midi' || bg.DinnerSituation === 'Après repas du soir') {
        if (bg.BG <= 140) {
          backgroundColor = 'rgb(142, 194, 31)';
        }
        else if (bg.BG > 140 && bg.BG <= 180) {
          backgroundColor = 'rgb(241, 150, 0)';
        }
        else if (bg.BG > 180) {
          backgroundColor = 'rgb(229, 1, 18)';
        }
      }
      else if (bg.BG >= 250) {
        backgroundColor = 'rgb(161,0,230)';
      }

      return {
        'background-color': backgroundColor,
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
        return moment(d, 'X').format('DD/MM HH:mm');  //uncomment for date format
      }
    };

    $scope.toolTipContentFunction = function () {
      return function (key, x, y, e, graph) {
        return 'Informations' +
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
      var result = '';
      if ($scope.patientInfos.gender) {
        switch ($scope.patientInfos.gender) {
          case 'Male':
            result += 'Homme';
            break;
          case 'Female':
            result += 'Femme';
            break;
        }
      }
      if (result.length && $scope.patientInfos.age) {
        result += ' - ';
      }
      if ($scope.patientInfos.age) {
        result += $scope.patientInfos.age + ' ans'
      }
      return result;
    };
    $scope.goBack = function () {
      $location.path('/medecin');
    };

    $scope.bpIndex = 0;
    $scope.lastBpIndex = function () {
      $scope.bpIndex = $scope.BPDatas.length - 1;
    };
    $scope.previousBpIndex = function () {
      $scope.bpIndex++;
    };
    $scope.nextBpIndex = function () {
      $scope.bpIndex--;
    };
    $scope.firstBpIndex = function () {
      $scope.bpIndex = 0;
    };
    $scope.showLastBpIndex = function () {
      return $scope.bpIndex != $scope.BPDatas.length - 1;
    };
    $scope.showPreviousBpIndex = function () {
      return $scope.bpIndex != $scope.BPDatas.length - 1;
    };
    $scope.showNextBpIndex = function () {
      return $scope.bpIndex != 0;
    };
    $scope.showFirstBpIndex = function () {
      return $scope.bpIndex != 0;
    };

    $scope.bgIndex = 0;
    $scope.lastBgIndex = function () {
      $scope.bgIndex = $scope.BGDatas.length - 1;
    };
    $scope.previousBgIndex = function () {
      $scope.bgIndex++;
    };
    $scope.nextBgIndex = function () {
      $scope.bgIndex--;
    };
    $scope.firstBgIndex = function () {
      $scope.bgIndex = 0;
    };
    $scope.showLastBgIndex = function () {
      return $scope.bgIndex != $scope.BGDatas.length - 1;
    };
    $scope.showPreviousBgIndex = function () {
      return $scope.bgIndex != $scope.BGDatas.length - 1;
    };
    $scope.showNextBgIndex = function () {
      return $scope.bgIndex != 0;
    };
    $scope.showFirstBgIndex = function () {
      return $scope.bgIndex != 0;
    };
  });
