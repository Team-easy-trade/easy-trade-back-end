'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());


const logger = require('./middleware/logger.js');
app.use(logger);


const router = require('./route/router.js');
app.use('/api/v1',router);


// routes error handlers
const fourOfour = require('./middleware/404');
app.use('*', fourOfour);
const svrErrors = require('./middleware/error');
app.use(svrErrors);



module.exports={
  server: app,
  start: () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
  },
};