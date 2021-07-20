'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail;
const SECRET = process.env.USER_SECRET;


const user = new mongoose.Schema({
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
  email: {
    type: String,
    required: true, 
    validate: [ isEmail, 'invalid email' ],
  },
  phone: {
    type: Number,
    required: true,
    // validate: [ ]
  },
  role: { 
    type: String, 
    // required: true, 
    default: 'user', 
    enum: ['admin', 'user'],
  },
  location: {
    type: String,
    required: true,
  },
});

// before sve the user to DB, hash the password
user.pre('save', async function(){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
  }
});

// mongoose model statics method is attached to the model (class), while methods is attached to the instance of the model (a specific document)

/**
 * function to basic valid a username and password. returns null if: user does not exsit or bad password
 * @param {String} username 
 * @param {String} password 
 * @returns a user obj or null
 */
user.statics.basicValidation = async function(username, password) {
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

/**
 * 
 * @returns {String} a signed token
 */
user.methods.tokenGenerator = function () {
  const token = {
    id: this._id,
    username: this.username,
    role: this.role,
  };
  return jwt.sign(token, SECRET);
};

/**
 * find one user from DB, if no user found, returns null
 * @param {String} username 
 * @returns a user object or null
 */
user.methods.validation = function(username) {
  const query = { username };
  return this.findOne(query);
};


/**
 * 
 * @param {String} token 
 * @returns A user object or null
 */
user.statics.authenticateToken = function (token) {

  try {
    const parsedToken = jwt.verify(token, SECRET);

    return this.findById(parsedToken.id);
  } catch (e) { throw new Error('Invalid Token'); }

};


module.exports = mongoose.model('user', user);

