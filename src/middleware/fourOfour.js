'use strict';

module.exports = (req,res,next) => {

  const error = {message_spec: 'The web resource you requested does not exist', statusCode:404, statusMessage:'Not Found'};
  next(error);
};