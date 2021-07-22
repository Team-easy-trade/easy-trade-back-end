'use strict';

const mongoose = require('mongoose');
const listing = new mongoose.Schema({
// ToDo: add fields
  name: { 
    type: String, 
    required: true, 
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description:{
    type:String,
    required: true,
  },
  category: {
    type:`String`,
    required:true,
    maxLength: 20,
  },
  image: {
    type:String,
    required:true,
  },
  owner: {
    type:String,
    required:true,
  },

});


module.exports = mongoose.model('listing', listing);