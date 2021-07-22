'use strict';
const listingModel = require('../model/listing.js');


module.exports = (req, res, next)=>{
  let model = req.params.model;

  switch (model) {
    case 'listing':
      req.model = listingModel;
      next();
      return;
  }
};