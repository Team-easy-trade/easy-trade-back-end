"use strict";

module.exports = (req, res, next) => {
  // todo: verify this guy is an admin.  check roleValidation.js as an example
  const adminErr = {
    message_spec: "Access Denied. Invalid Admin.",
    statusCode: 403,
    statusMessage: "Authroization Error",
  };

  if (req.body.role && req.body.role != "admin") {
    next(adminErr);

    return;
  }

  next();
};
