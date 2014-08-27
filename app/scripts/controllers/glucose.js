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
