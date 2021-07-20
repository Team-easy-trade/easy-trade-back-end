'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// our own logger to log all incomming requests
const logger = require('./middleware/logger.js');
app.use(logger);

// use our router
const router = require('./route/router.js');
app.use('/api/v1',router);

// if incomming requests fails to hit any routes,the 404 handlers kicks in
const fourOfour = require('./middleware/fourOfour.js');
app.use('*', fourOfour);

// if incomming requests fails at middleware, or bring internal errors, this 500 error handlers kicks in. This is our fail safe
const svrErrors = require('./middleware/fiveHundred.js');
app.use(svrErrors);


module.exports={
  server: app,
  start: () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
  },
};