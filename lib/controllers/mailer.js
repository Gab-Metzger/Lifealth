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
    user: 'medmarket@itaware.eu',
    pass: 'ep98ts112'
  }
});

exports.sendMail = function(email, doctor) {
  var mailOptions = {
    from: 'Dr '+ doctor.lastName + '<' + doctor.email + '>',
    to: email,
    subject: 'Votre médecin souhaite accéder à vos données sur Lifealth',
    text: 'Bonjour,\n\nPour partager vos données avec votre médecin :\n\nInscrivez-vous en suivant ce lien http://'+config.domain+'/subscribe?email='+email+'\n\nService Relation Client\nLifealth',
    html: 'Bonjour,<br><br>Pour partager vos données avec votre médecin :<br><br><a href="http://'+config.domain+'/subscribe?email='+email+'">Inscrivez-vous</a><br><br>Service Relation Client<br>Lifealth'
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
    text: 'Bonjour,\n\nVous avez fait une demande pour recréez votre mot de passe perdu. \nSi vous n\'êtes pas l\'auteur de cette demande ignorez cet email. Sinon modifiez votre mot de passe en suivant ce lien http://'+config.domain+'/newPassword/'+uuid+'\n\nService Relation Client\nLifealth',
    html: 'Bonjour,<br><br>Vous avez fait une demande pour recréez votre mot de passe perdu. <br>Si vous n\'êtes pas l\'auteur de cette demande ignorez cet email. <br>Sinon<a href="http://'+config.domain+'/newPassword/'+uuid+'">modifiez votre mot de passe</a><br><br>Service Relation Client<br>Lifealth'
  };
  mail.sendMail(mailOptions, function(err, response) {
    if (err) {
      console.log('Error! '+err);
    } else {
      console.log('Sent! '+response.message);
    }
  });
}
