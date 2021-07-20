'use strict';

module.exports =  (err, req, res, next) => {

  console.log(err);
  res.statusCode = err.statusCode || 500;
  res.statusMessage = err.statusMessage || 'Server internal error occurred. Please try again later.';
  res.send( err.message_spec || 'Server internal error occurred. Please try again later.');
  res.end();
};