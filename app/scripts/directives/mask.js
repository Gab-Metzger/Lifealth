'use strict';
angular.module('lifealthApp').directive('mask', function () {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      if (attrs.mask == 'date') {
        element.mask("99/99/9999");
        modelCtrl.$parsers.push(function(date) {
          var value = moment(date,'DD/MM/YYYY');
          if (value.isValid()) {
            modelCtrl.$setValidity('format', true);
            return value.unix();
          } else {
            modelCtrl.$setValidity('format', false);
            return modelCtrl.$modelValue;
          }
        });
        modelCtrl.$formatters.push(function(value) {
          if (value) {
            return moment.utc(value, 'X').format('DD/MM/YYYY');
          } else {
            return '';
          }
        });
      }
    }
  }
});
