'use strict';

angular.module('lifealthApp')
  .controller('BloodpressureCtrl', function ($scope, PatientData) {
    $scope.BPDatas = [];
    $scope.BPClassified = [];
    $scope.datesBP = {
      'startDate': moment().subtract('days', 7),
      'endDate': moment()
    };

    $scope.$watch('datesBP', function (value) {
      $scope.bpIndex = 0;
      $scope.BPDatas = [];
      $scope.BPClassified = [];
      $scope.htaValues = [];
      $scope.smiley = {
        img: '',
        texte: ''
      };
      $scope.searchingBp = true;
      PatientData.getBPData(value.startDate, value.endDate)
        .then(function () {
          $scope.BPDatas = PatientData.bpData;
          $scope.BPClassified = PatientData.classifiedBpData;
          $scope.smiley = PatientData.getBpSmiley(PatientData.getHTAValues($scope.BPClassified[0].values));
          $scope.searchingBp = false;
        })
        .catch(function (err) {
          $scope.bpIndex = 0;
          $scope.BPDatas = [];
          $scope.BPClassified = [];
          $scope.htaValues = [];
          $scope.smiley = {
            img: '',
            texte: ''
          };
          $scope.searchingBp = false;
        });
    });

    $scope.msg = ':-)';

    $scope.getBPDataLength = function () {
      if (PatientData.bpLength == 0) {
        return 'aucune mesure trouvée';
      }
      return PatientData.bpLength + ' mesure' + ((PatientData.bpLength > 1) ? 's' : '');
    };

    $scope.bgColor = function (bp) {
      var color = PatientData.getColor(bp);
      return {
        'background-color': color,
        'color': 'white'
      };
    };

    $scope.addBPData = function () {
      $scope.editingBpData = true;
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
      if (this.bpForm.$valid) {
        PatientData.updateBpData(bp).then(function() {
          bp.manual = undefined;
          bp.edit = true;
        }).catch(function(err) {
          console.log('valid BP data error : '+err);
        });
        $scope.editingBpData = false;
      }
    };

    $scope.cancelBPData = function (bp) {
      if (bp._id) {
        bp.manual = undefined;
        bp.edit = true;
      } else {
        $scope.BPDatas[0].splice($scope.BPDatas[0].indexOf(bp), 1);
      }
      $scope.editingBpData = false;
    };

    $scope.editBPData = function (bp) {
      $scope.editingBpData = true;
      bp.manual = true;
      bp.edit = false;
      bp.HP = +bp.HP;
      bp.LP = +bp.LP;
      bp.HR = +bp.HR;
    };

    $scope.removeBPData = function (bp) {
      PatientData.removeBpData(bp).then(function() {
        $scope.BPDatas[0].splice($scope.BPDatas[0].indexOf(bp), 1);
      }).catch(function(err) {
        console.log('remove BP data error : ' +err);
      });
    };

    $scope.errorMessage = function () {
      if (this.bpForm.MDate && this.bpForm.MDate.$invalid) {
        return 'La date/heure doit renseignée au format DD/MM hh:mm';
      }
      if (this.bpForm.HP && this.bpForm.HP.$invalid) {
        return 'La PAS doit être renseignée avec une valeur entre 60 et 250';
      }
      if (this.bpForm.LP && this.bpForm.LP.$invalid) {
        return 'La PAD doit être renseignée avec une valeur entre 40 et 130';
      }
      if (this.bpForm.HR && this.bpForm.HR.$invalid) {
        return 'La fréquence cardiaque doit être renseignée avec une valeur entre 40 et 220';
      }
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
      return $scope.BPDatas.length > 0 && $scope.bpIndex != $scope.BPDatas.length - 1;
    };
    $scope.showPreviousBpIndex = function () {
      return $scope.BPDatas.length > 0 && $scope.bpIndex != $scope.BPDatas.length - 1;
    };
    $scope.showNextBpIndex = function () {
      return $scope.BPDatas.length > 0 && $scope.bpIndex != 0;
    };
    $scope.showFirstBpIndex = function () {
      return $scope.BPDatas.length > 0 && $scope.bpIndex != 0;
    };
  });
