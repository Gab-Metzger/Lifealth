'use strict';

describe('Service: Patiendata', function () {

  // load the service's module
  beforeEach(module('lifealthApp'));

  // instantiate service
  var Patiendata;
  beforeEach(inject(function (_Patiendata_) {
    Patiendata = _Patiendata_;
  }));

  it('should do something', function () {
    expect(!!Patiendata).toBe(true);
  });

});
