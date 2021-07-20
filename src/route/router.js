'use strict';

const express = require('express');
const router = express.Router();

const {signup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./userRouteHandler.js');

const basicAuth = require('../middleware/basicAuth');
const bearerAuth = require('../middleware/bearerAuth.js');
const roleValidation = require('../middleware/roleValidation.js');
const adminValidation = require('../middleware/adminValidation.js');
const dataValidation = require('../middleware/dataValidation.js');
const userValidation = require('../middleware/userValidation.js');



// User routes definitions

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

module.exports = router;
