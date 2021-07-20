'use strict';
module.exports = (req, res, next) => {

  const ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || 'No IP detected';
  const time = new Date();


  console.log('\n', `Web request from IP address: "${ip}" `, '\n', `  Using "${req.method}" method`, '\n', `  At ${time}`, '\n', `  The requested URL is "${req.path}"`, '\n');
  
  next();
};
