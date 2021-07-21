'use strict';

module.exports = (req, res, next)=>{

  // this is a sample
  const roleErr = {message_spec: 'Access Denied. Invalid User Role.', statusCode:403, statusMessage:'Authorization Error'};

  if (req.body.role && req.body.role != 'user'){
    next(roleErr);

    return;
  }

  next();
};
