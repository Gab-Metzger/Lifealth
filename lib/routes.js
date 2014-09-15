'use strict';

var api = require('./controllers/api'),
  index = require('./controllers'),
  users = require('./controllers/users'),
  session = require('./controllers/session'),
  doctors = require('./controllers/doctors'),
  notifications = require('./controllers/notifications'),
  middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {

  // Server API Routes
  app.route('/subscribe')
    .get(api.subscribe);
  app.route('/lostPassword')
    .post(api.lostPassword);
  app.route('/newPassword/:id')
    .get(api.newPassword);
  app.route('/changePassword')
    .post(api.changePassword);

  app.route('/api/users')
    .post(users.create)
    .put(users.update);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id/doctors')
    .get(users.doctors);
  app.route('/api/users/:id/doctors/:doctorId')
    .delete(users.removeDoctor);
  app.route('/api/users/:id/bp')
    .get(users.getBPDatas)
    .post(users.updateBpData);
  app.route('/api/users/:id/bp/:bpId')
    .get(users.getBpData)
    .delete(users.removeBpData);
  app.route('/api/users/:id/bg')
    .get(users.getBGDatas)
    .post(users.updateBgData);
  app.route('/api/users/:id/bg/:bgId')
    .get(users.getBgData)
    .delete(users.removeBgData);
  app.route('/api/users/:id')
    .get(users.show);
  app.route('/api/users/:id/unlink')
    .get(users.unlink);

  app.route('/api/doctors/:id/records/:recordId')
    .delete(doctors.removeRecord);

  app.route('/api/doctors/:id/records')
    .get(doctors.records)
    .post(doctors.addRecord);
  app.route('/api/doctors/:id/invites')
    .get(doctors.invites);
  app.route('/api/doctors/:doctorId/invites/:inviteId')
    .delete(doctors.removeInvite)
    .get(doctors.reInvite);

  app.route('/notification/iHealth')
    .post(notifications.new);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/auth/iHealth')
    .get(session.auth);
  app.route('/auth/iHealth/callback')
    .get(session.authCallback);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function (req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get(middleware.setUserCookie, index.index);
};
