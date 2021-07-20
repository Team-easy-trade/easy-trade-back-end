'use strict';
require('dotenv').config();

const userModel = require('../../model/user.js');

// sequence of prams matters. res is not being used, but do NOT remove it
module.exports = async (req, res, next) => {

  const authenticationErr = {message_spec: 'User can NOT be authenticated. Please login again.', statusCode: 401, statusMessage:'Unauthenticated'};

  if (!req.headers.authorization) {
    next(authenticationErr);
    // kill the rest of codes
    return;
  }

  const token = req.headers.authorization.split(' ').pop();

  let validUser;
  try{
    validUser = await userModel.findUserByToken(token);
  }
  catch (err){
    next(authenticationErr);
    // kill the rest of codes
    return;
  }

  if (validUser) {
    validUser.password = undefined;
    req.user = validUser;
    req.token = token;
    next();
  } else {
    next(authenticationErr);
  }

};