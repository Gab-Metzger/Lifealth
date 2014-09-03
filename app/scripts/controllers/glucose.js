'use strict';

angular.module('lifealthApp')
  .controller('GlucoseCtrl', function ($scope, PatientData) {
    $scope.BGDatas = [];
    $scope.BGClassified = [];
    $scope.momentBG = 'Aucun';
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

    $scope.getBGDataLength = function () {
      if (PatientData.bgLength == 0) {
        return 'aucune mesure trouvée';
      }
      return PatientData.bgLength + ' mesure' + ((PatientData.bgLength > 1) ? 's' : '');
    };

    $scope.addBGData = function () {
      $scope.editingBgData = true;
      if ($scope.BGDatas.length == 0) {
        $scope.BGDatas[0] = [];
      }
      $scope.BGDatas[0].unshift({
        MDate: moment().format('DD/MM HH:mm'),
        manual: true,
        edit: false
      });
    };

    $scope.validBGData = function (bg) {
      if (this.bgForm.$valid) {
        PatientData.updateBgData(bg).then(function () {
          bg.manual = undefined;
          bg.edit = true;
        }).catch(function (err) {
          console.log('valid BG data error : ' + err);
        });
        $scope.editingBgData = false;
      }
    };

    $scope.cancelBGData = function (bg) {
      if (bg._id) {
        bg.manual = undefined;
        bg.edit = true;
      } else {
        $scope.BGDatas[0].splice($scope.BGDatas[0].indexOf(bg), 1);
      }
      $scope.editingBgData = false;
    };

    $scope.editBGData = function (bg) {
      $scope.editingBgData = true;
      bg.manual = true;
      bg.edit = false;
      bg.BG = +bg.BG;
    };

    $scope.removeBGData = function (bg) {
      PatientData.removeBgData(bg).then(function () {
        $scope.BGDatas[0].splice($scope.BGDatas[0].indexOf(bg), 1);
      }).catch(function (err) {
        console.log('remove BG data error : ' + err);
      });
    };

    $scope.errorMessage = function () {
      if (this.bgForm.MDate && this.bgForm.MDate.$invalid) {
        return 'La date/heure doit être renseignée au format DD/MM hh:mm';
      }
      if (this.bgForm.DinnerSituation && this.bgForm.DinnerSituation.$invalid) {
        return 'Le moment de mesure doit être renseigné';
      }
      if (this.bgForm.BG && this.bgForm.BG.$invalid) {
        return 'Le taux de glycémie doit être renseigné avec une valeur entre 40 et 130 mg/dl';
      }
    };

    $scope.moments = function() {
      return PatientData.MOMENTS;
    };

    $scope.moment = function(bg) {
      return PatientData.MOMENTS[bg.DinnerSituation];
    };

    $scope.momentColor = function (bg) {
      var backgroundColor = 'black';
      if (bg.DinnerSituation === 'Before_breakfast' || bg.DinnerSituation === 'Before_lunch' || bg.DinnerSituation === 'Before_dinner') {
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
      else if (bg.DinnerSituation === 'After_breakfast' || bg.DinnerSituation === 'After_lunch' || bg.DinnerSituation === 'After_dinner') {
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
      return $scope.BGDatas.length > 0 && $scope.bgIndex != $scope.BGDatas.length - 1;
    };
    $scope.showPreviousBgIndex = function () {
      return $scope.BGDatas.length > 0 && $scope.bgIndex != $scope.BGDatas.length - 1;
    };
    $scope.showNextBgIndex = function () {
      return $scope.BGDatas.length > 0 && $scope.bgIndex != 0;
    };
    $scope.showFirstBgIndex = function () {
      return $scope.BGDatas.length > 0 && $scope.bgIndex != 0;
    };
  });
