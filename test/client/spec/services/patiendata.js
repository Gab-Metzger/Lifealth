'use strict';

describe('Service: Patiendata', function () {

  // load the service's module
  beforeEach(module('lifealthApp'));

  // instantiate service
  var pd;
  var hb,rt;
  beforeEach(inject(function (_PatientData_, $httpBackend, $rootScope) {
    pd = _PatientData_;
    hb = $httpBackend;
    rt = $rootScope;
    rt.currentUser = {};
    rt.currentUser.id = '123';
  }));

  it('should do something with BP datas', function () {
    var from = moment(), to = moment();
    hb.expectGET('/api/users/123/bp?from=' + from.unix() + '&to=' + to.unix()).respond('[{"BPL":5,"DataID":"ae559b7e0ed04c0f9765c8a9b0dfdca7","HP":122,"HR":81,"IsArr":0,"LP":76,"LastChangeTime":1406316150,"Lat":0,"Lon":0,"MDate":1406323350,"Note":""},{"BPL":5,"DataID":"3ae43d1694f64765842b6b675feaac44","HP":121,"HR":83,"IsArr":0,"LP":76,"LastChangeTime":1406316103,"Lat":0,"Lon":0,"MDate":1406323303,"Note":""},{"BPL":4,"DataID":"15b9206fe32b4ef0b950c4523cad12e5","HP":131,"HR":84,"IsArr":0,"LP":87,"LastChangeTime":1406316054,"Lat":0,"Lon":0,"MDate":1406323254,"Note":""},{"BPL":6,"DataID":"d1bb839748fa4f42a0b2f131ddf4fb17","HP":104,"HR":65,"IsArr":0,"LP":67,"LastChangeTime":1406315956,"Lat":0,"Lon":0,"MDate":1406323153,"Note":""},{"BPL":6,"DataID":"e4f459a86bb64c74a9bf77d1d24e0675","HP":104,"HR":65,"IsArr":0,"LP":67,"LastChangeTime":1406315962,"Lat":0,"Lon":0,"MDate":1406323153,"Note":""},{"BPL":6,"DataID":"44ef7348a1b74ed6b15cce37c30246c1","HP":104,"HR":65,"IsArr":0,"LP":67,"LastChangeTime":1405663648,"Lat":0,"Lon":0,"MDate":1405670820,"Note":""},{"BPL":6,"DataID":"20299190b1e743e8818b3e8fbc3af780","HP":101,"HR":75,"IsArr":0,"LP":75,"LastChangeTime":1405663576,"Lat":0,"Lon":0,"MDate":1405670765,"Note":"bras gauche"},{"BPL":6,"DataID":"d2b958c0602340e0a9ae7879430267ff","HP":100,"HR":79,"IsArr":0,"LP":70,"LastChangeTime":1405663499,"Lat":0,"Lon":0,"MDate":1405670690,"Note":"top"},{"BPL":6,"DataID":"5436255b649d42bcb5ab6170acc4082c","HP":111,"HR":70,"IsArr":85,"LP":74,"LastChangeTime":1405663458,"Lat":0,"Lon":0,"MDate":1405670639,"Note":"cool"}]');
    pd.getBPData(from, to);
    hb.flush();
    expect(pd.bpData.length).toBe(2)
    expect(pd.bpData[0].length).toBe(6);
    expect(pd.bpData[1].length).toBe(3);
    expect(pd.classifiedBpData[0].values.length).toBe(6);
    expect(pd.classifiedBpData[0].values[0][1]).toBe(66.7);
    expect(pd.classifiedBpData[0].values[1][1]).toBe(22.2);
    expect(pd.classifiedBpData[0].values[2][1]).toBe(11.1);
    expect(pd.classifiedBpData[0].values[3][1]).toBe(0);
    expect(pd.classifiedBpData[0].values[4][1]).toBe(0);
    expect(pd.classifiedBpData[0].values[5][1]).toBe(0);
  });

});
