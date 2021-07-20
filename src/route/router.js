'use strict';

const express = require('express');
const router = express.Router();

const {signup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./handlers/userHandlers.js');

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



module.exports = router;
