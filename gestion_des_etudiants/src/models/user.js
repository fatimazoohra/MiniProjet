
let mongoose = require('mongoose')
let Schema = require('mongoose').Schema
let connection = require('../database');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

var User = connection.model('User', UserSchema);
module.exports = User;
