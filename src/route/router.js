'use strict';

const express = require('express');
const router = express.Router();

const {signup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./handlers/userHandlers.js');
const {getAllListings, postListing, deleteListing, editListing, getAllListingsByUserId, getAllListingsByCategory,searchListingsByDescription } = require('./handlers/listingHandlers');
const basicAuth = require('../middleware/auth/basic.js');
const bearerAuth = require('../middleware/auth/bearer.js');
const roleValidation = require('../middleware/roleValidation.js');
const adminValidation = require('../middleware/adminValidation.js');
const dataValidation = require('../middleware/dataValidation.js');
const userValidation = require('../middleware/userValidation.js');



// User routes definations

// regular user can ONLY sign up as a user;
router.post('/signup', roleValidation, dataValidation, signup);

// admin signup, admin can be only added by another admin.
router.post('/adminsignup', bearerAuth, adminValidation, dataValidation, signup); 

router.post('/signin', basicAuth, signin);


router.get('/allusers', bearerAuth, adminValidation, getAll);

router.get('/user/:id', bearerAuth,  getOne);

router.patch('/user/:id', bearerAuth, userValidation, updateOne);

router.patch('/user/:id/password', bearerAuth, userValidation, updatePassword);

router.delete('/user/:id', bearerAuth, userValidation, deleteOne);


// listings routes definations

router.get('/listings', getAllListings);
router.post('/listing', bearerAuth, userValidation, postListing);
router.delete('/listing/:id', bearerAuth, userValidation, deleteListing);
router.patch('/listing/:id', bearerAuth, userValidation, editListing);
router.get('/listings/id/:id', getAllListingsByUserId);
router.get('/listings/category/:category', getAllListingsByCategory);
router.get('/listing',searchListingsByDescription);

module.exports = router;
