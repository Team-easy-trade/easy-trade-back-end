'use strict';

const base64 = require('base-64');

const Users = require('../../model/user.js');

// sequence of prams matters. res is not being used, but do NOT remove it
module.exports = async (req, res, next)=>{
  const invalidErr = { 'message_spec': 'Invalid username or password. Please try again.', 'statusCode': 401, 'statusMessage': 'Unauthenticated' };

  if (! req.headers.authorization) {
    next(invalidErr);
    return;
  }

  try{
    const basic = req.headers.authorization.split(' ').pop();
    const [username, password] = base64.decode(basic).split(':');
    const validUser = await Users.basicValidation(username, password);
    
    if (validUser) {
      const token = validUser.tokenGenerator();
      req.token = token;
      req.user = validUser;
      next();
    } else {
      next(invalidErr);
    }
  }
  catch (error) {
    next(error);
  }
};