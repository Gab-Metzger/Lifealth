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
    $scope.currentPage = 1;
    $scope.maxPages = 3;

    $scope.$watch('datesBG', function (value) {
      $scope.BGDatas = [];
      $scope.BGClassified = [];
      $scope.BGHisto = [];
      $scope.hba1c = '';
      $scope.searchingBg = true;
      PatientData.getBGData(value.startDate, value.endDate, $scope.momentBG).then(function () {
        $scope.BGDatas = PatientData.bgData;
        $scope.BGClassified = PatientData.classifiedBgData;
        $scope.BGHisto = PatientData.histoBgData;
        $scope.averageBG = PatientData.averageBG;
        $scope.hba1c = PatientData.hba1c;
        $scope.searchingBg = false;
      }).catch(function () {
        $scope.BGDatas = [];
        $scope.BGClassified = [];
        $scope.BGHisto = [];
        $scope.hba1c = '';
        $scope.searchingBg = false;
      });
    });

    $scope.$watch('momentBG', function (value) {
      $scope.BGDatas = [];
      $scope.BGClassified = [];
      $scope.BGHisto = [];
      $scope.hba1c = '';
      $scope.searchingBg = true;
      PatientData.getBGData($scope.datesBG.startDate, $scope.datesBG.endDate, value).then(function () {
        $scope.BGDatas = PatientData.bgData;
        $scope.BGClassified = PatientData.classifiedBgData;
        $scope.BGHisto = PatientData.histoBgData;
        $scope.averageBG = PatientData.averageBG;
        $scope.hba1c = PatientData.hba1c;
        $scope.searchingBg = false;
      }).catch(function () {
        $scope.BGDatas = [];
        $scope.BGClassified = [];
        $scope.BGHisto = [];
        $scope.hba1c = '';
        $scope.searchingBg = false;
      });
    });

    /*$scope.filter = function () {
      $scope.BGDatas = PatientData.momentFilterBg($scope.momentBG);
    };*/

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
        return 'Le taux de glycémie doit être renseigné avec une valeur entre 20 et 600 mg/dl';
      }
    };

    $scope.moments = function() {
      return PatientData.MOMENTS;//.sort(function(a,b) {return a.order - b.order});
    };

    $scope.moment = function(bg) {
      return PatientData.moment(bg);
    };

    $scope.momentColor = function (bg) {
      return PatientData.momentColor(bg);
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
