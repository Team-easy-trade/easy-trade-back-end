'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail;
const SECRET = process.env.USER_SECRET;


const users = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 20,
  },
  password: { 
    type: String, 
    required: true,
    minlength: 5,
  },
  email: {type: String, validate: [ isEmail, 'invalid email' ]},
  role: { type: String, required: true, default: 'user', enum: ['admin', 'user']},
});


users.pre('save', async function(){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
  }
});


users.statics.basicValidation = async function(username, password) {
  const query = { username };
  try{
    const user = await this.findOne(query);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user: null;
  }
  catch (err){
    console.error(err);
  }
};


users.methods.tokenGenerator = function () {
  const token = {
    id: this._id,
    username: this.username,
    role: this.role,
  };
  return jwt.sign(token, SECRET);
};


users.methods.validation = function(username) {
  const query = { username };
  return this.findOne(query);
};


users.statics.authenticateToken = function (token) {

  try {
    const parsedToken = jwt.verify(token, SECRET);

    return this.findById(parsedToken.id);
  } catch (e) { throw new Error('Invalid Token'); }

};


module.exports = mongoose.model('users', users);

