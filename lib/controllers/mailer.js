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

exports.sendMail = function(email) {
  var mailOptions = {
    from: 'Lifealth <contact@lifealth.com>',
    to: email,
    subject: 'Votre médecin vous invite sur Lifealth',
    text: 'Avec Lifealth partagez vos donées avec votre médecin et gérer votre parcours de soins.\n\nInscrivez-vous en suivant ce lien http://'+config.domain+'/subscribe?email='+email+'\n\nService Relation Client\nLifealth',
    html: 'Avec Lifealth partagez vos donées avec votre médecin et gérer votre parcours de soins.<br><br><a href="http://'+config.domain+'/subscribe?email='+email+'">Inscrivez-vous</a><br><br>Service Relation Client<br>Lifealth'
  };
  mail.sendMail(mailOptions, function(err, response) {
    if (err) {
      console.log('Error! '+err);
    } else {
      console.log('Sent! '+response.message);
    }
  });

}