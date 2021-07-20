'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');

// config mongoDB and connect to it.
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

async function connectDB () {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('connected to DB');
  } catch (error){
    console.log('**** DB connection error',error);
  }
} 
connectDB();

// start our express server
server.start();
