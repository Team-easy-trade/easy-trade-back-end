'use strict';

const express = require('express');
const router = express.Router();

const {signup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./handlers/userHandlers.js');
const {getAllListings, postListing, deleteListing, editListing, getAllListingsByUserId, getAllListingsByCategory } = require('./handlers/listingHandlers');
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

router.get('/user/:id', bearerAuth, userValidation, getOne);

router.patch('/user/:id', bearerAuth, userValidation, updateOne);

router.patch('/user/:id/password', bearerAuth, userValidation, updatePassword);

router.delete('/user/:id', bearerAuth, userValidation, deleteOne);


// listings routes definations
// ToDo: think about how to creates URLs, and what middle ware you need to use, and how to design handlers

//pass in middleware "bearerAuth" --this is to make sure to authorize the user...this ultimately allows them to edit/delete/post their own content, userValidation
//we should only allow one user to modify their own stuff
//do this in listing validation
router.get('/alllistings', getAllListings);
router.post('/listing', bearerAuth, userValidation, postListing)
router.delete('/listing/:id', bearerAuth, userValidation, deleteListing)
router.patch('/listing/:id', bearerAuth, userValidation, editListing)
router.get('/listings/id/:id', getAllListingsByUserId)
router.get('/listings/category/:category', getAllListingsByCategory)
module.exports = router;
