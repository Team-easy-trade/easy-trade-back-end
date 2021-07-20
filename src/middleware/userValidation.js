'use strict';

module.exports = async (req, res, next)=>{
  // todo: user info can only be changed by the same user, or the admin.
  next();
};