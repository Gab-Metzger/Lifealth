/**
 * Created with IntelliJ IDEA.
 * User: sebmade
 * Date: 13/07/2014
 * Time: 09:45
 * To change this template use File | Settings | File Templates.
 */
'use strict';
var config = require('../config/config');
var mail = require('nodemailer').createTransport("SMTP", {
  service: "Gmail",
  debug: true,
  auth: {
    user: 'hello@lifealth.com',
    pass: 'ta45dr39'
  }
});

exports.sendMail = function(patient, doctor, notes) {
  var mailOptions = {
    from: 'Dr '+ doctor.lastName + '<' + doctor.email + '>',
    to: patient.email,
    subject: 'Votre médecin souhaite accéder à vos données sur Lifealth',
    text: 'Bonjour,\n\nPour partager vos données avec votre médecin :\n\nInscrivez-vous en suivant ce lien http://'+config.domain+'/subscribe?email='+patient.email+'\n\nService Relation Client\nLifealth',
    html: 'Bonjour '+patient.firstName+' '+patient.lastName+',<br><br>Message du Dr '+doctor.firstName+' '+doctor.lastName+':<br> '+notes.replace("\n","<br>")+'<br/><br/>Pour partager vos données avec votre médecin :<br><br><a href="http://'+config.domain+'/subscribe?email='+patient.email+'">Inscrivez-vous</a><br><br>En cas de besoin veuillez consulter : <ul><li><a href="https://docs.google.com/document/d/1pKJvOGKm1WKryeDiMXvJL2z6fhf1a8OX-gDjmgrAELM/edit?usp=sharing">Protocole BP5 tension artérielle</a></li><li><a href="https://docs.google.com/document/d/1ZESp_kJ_5erU-0vPArtXTU8gFCb4OK1dmHBCRWb3wuo/edit">Protocole BG5 glycémie</a></li><li><a href="https://docs.google.com/document/d/197iQH5Ar-kD21PgBYh3JKZb6U3BLRGgSeuTiBg-gcjk/edit?usp=sharing">Protocole saisie manuelle sur application iHealthMyVitals</a> </li></ul><br><br>Service Relation Client<br>Lifealth'
  };
  mail.sendMail(mailOptions, function(err, response) {
    if (err) {
      console.log('Error! '+err);
    } else {
      console.log('Sent! '+response.message);
    }
  });

}

exports.sendMailLostPassword = function(user, uuid) {
  var mailOptions = {
    from: 'Support Lifealth <support@lifealth.com>',
    to: user.email,
    subject: 'Recréez votre mot de passe',
    text: 'Bonjour,\n\nVous avez fait une demande pour recréer votre mot de passe perdu. \nSi vous n\'êtes pas l\'auteur de cette demande ignorez cet email. Sinon modifiez votre mot de passe en suivant ce lien http://'+config.domain+'/newPassword/'+uuid+'\n\nService Relation Client\nLifealth',
    html: 'Bonjour,<br><br>Vous avez fait une demande pour recréer votre mot de passe perdu. <br>Si vous n\'êtes pas l\'auteur de cette demande ignorez cet email. <br>Sinon <a href="http://'+config.domain+'/newPassword/'+uuid+'">modifiez votre mot de passe</a><br><br>Service Relation Client<br>Lifealth'
  };
  mail.sendMail(mailOptions, function(err, response) {
    if (err) {
      console.log('Error! '+err);
    } else {
      console.log('Sent! '+response.message);
    }
  });
}

exports.notifyDoctor = function(doctor, user) {
    var mailOptions = {
        from: 'Support Lifealth <support@lifealth.com>',
        to: doctor.email,
        subject: 'Votre patient '+user.firstName+' '+user.lastName+' a accepté votre invitation',
        text: 'Bonjour, \n\nVotre patient '+user.firstName+' '+user.lastName+' a accepté votre invitation. \n\nVous pouvez accéder à ses données via votre compte professionnel. \n\nPour accéder à votre compte : http://doctor.lifealth.com\n\nService Relation Client\nLifealth',
        html: 'Votre patient '+user.firstName+' '+user.lastName+' a accepté votre invitation. <br><br>Vous pouvez accéder à ses données via votre compte professionnel. <br><br>Pour accéder à votre compte <a href="http://doctor.lifealth.com">cliquez-ici</a><br><br>Service Relation Client\nLifealth'
    };
    mail.sendMail(mailOptions, function(err, response) {
        if (err) {
            console.log('Error! '+err);
        } else {
            console.log('Sent! '+response.message);
        }
    });
}
