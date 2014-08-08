describe('iHealth auth', function () {
  it('should auth', function () {
    //browser.debugger();
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:9000/#/patient').then(function (url) {
      element(by.id('login-ihealth')).click().then(function () {
        expect(browser.getTitle()).toEqual('iHealthLabs - Login');
        element(by.id('txtUserName')).sendKeys('sebastien.letelie@gmail.com');
        element(by.id('txtPsw')).sendKeys('win7352');
        element(by.id('Button1')).click().then(function () {
          browser.getTitle().then(function (title) {
            expect(title).toEqual('http://localhost:9000/#/patient');
          })
        });
      })
    });
  })
})