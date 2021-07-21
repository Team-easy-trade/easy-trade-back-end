'use strict';

module.exports = (req, res, next)=>{
  // this is a sample

  console.log('*** incoming body is: ', req.body);
  
  const usernameTooLongError = {message_spec: 'Username can NOT be longer than 20 characters', statusCode:422, statusMessage:'Unprocessable Entity'};

  const passwordTooShortError = {message_spec: 'Password can NOT be shorter than 5 characters', statusCode:422, statusMessage:'Unprocessable Entity'};

  if (req.body.username.length > 20) {
    next(usernameTooLongError);
    return;
  } 

  if (req.body.password.length < 5) {
    next(passwordTooShortError);
    return;
  }

  next();
};