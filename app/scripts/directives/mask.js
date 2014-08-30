'use strict';
angular.module('lifealthApp').directive('mask', function () {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      if (attrs.mask == 'date') {
        element.mask("99/99/9999", {
          completed: function () {
            var date = this.val();
            scope.$apply(function() {
              var value = moment(date,'DD/MM/YYYY');
              if (value.isValid()) {
                modelCtrl.$setViewValue(value.unix());
              } else {
                modelCtrl.$setValidity('format', false);
              }
            });
          }
        });
      }
    }
  }
});
