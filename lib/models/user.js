'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

//var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  id: String,
  lastName: String,
  firstName: String,
  nickname: String,
  dateofbirth: Number,
  gender: String,
  provider: String,
  email: String,
  role: String,
  hashedPassword: String,
  salt: String,
  accessToken: String,
  refreshToken: String,
  uuid: String,
  iHealth: {},
  links: [
    {email: String, id: String}
  ],
  bpDatas: [
    {HP: String, LP: String, HR: String, MDate: Number}
  ]
});


UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function () {
    return {
      'nickname': this.nickname,
      'dateofbirth': this.dateofbirth,
      'provider': this.provider,
      'gender': this.gender,
      'id': this._id.toString(),
      'role': this.role
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'lastName': this.lastName,
      'firstName': this.firstName,
      'weight': this.weight,
      'height': this.height,
      'gender': this.gender,
      'email': this.email,
      'age': this.age(),
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (this.provider != 'local') return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (this.provider != 'local') return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    if (this.isNew) {
      var self = this;
      this.constructor.findOne({email: value}, function (err, user) {
        if (err) throw err;
        if (user) {
          if (self.id === user.id) return respond(true);
          return respond(false);
        }
        respond(true);
      });
    } else respond(true);
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && this.provider == 'local')
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },


  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  age: function() {
    if (this.dateofbirth) {
      var ageDifMs = Date.now() - this.dateofbirth*1000;
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }
};

module.exports = mongoose.model('User', UserSchema);
