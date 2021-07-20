'use strict';

const userModel = require('../../model/user.js');


async function signup (req, res, next){
  const uniqueError = { 'message_spec': 'Username taken, please choose another one', 'statusCode': 409, 'statusMessage': 'Unique Fail' };
  
  try {
    const user = new userModel(req.body);
    const valid = await userModel.findOne({username: user.username});
    if(!valid){
      try{
        const savedUser = await user.save();
        const token = savedUser.tokenGenerator();
        delete savedUser.password;
        res.status(200).send({
          ...savedUser,
          token,
        });
      } catch (error) {
        next(error);
      }
    } 
    // not valid meas username already exsit
    else {
      next(uniqueError);
    }
  }
  // if anything goes wrong of the connection between server and DB server
  catch (err){
    next(err);
  }
}


async function signin (req, res, next){

  const user = {
    id: req.user._id,
    username: req.user.username,
    role: req.user.role,
    location: req.user.location,
    
  };
  res.send({
    token: req.token,
    user,
  });
}


async function verifyOne (req, res, next){
  const authenticationErr = {message_spec: 'User can NOT be authenticated. Please login again.', statusCode: 401, statusMessage:'Unauthenticated'};

  const token = req.headers.authorization.split(' ').pop();

  let validUser;
  try{
    validUser = await userModel.authenticateToken(token);
  }
  catch (err){
    next(authenticationErr);
    return;
  }

  if (validUser) {
    const user = {
      username: validUser.username,
      id: validUser._id,
      role: validUser.role,
    };
    res.status(200).send(user);
  } else {
    next(authenticationErr);
  }
}


function handlerGenerator (method){
  return async (req, res, next)=>{
    const id = req.params.id ? {_id:req.params.id } : {};

    try{
      let result;
      switch(method){

        case 'findAll': {
          const usersList = await userModel.find({});
          // remove password 
          result = usersList.map(user => {
            user.password = undefined;
            return user;
          });
          break;
        }

        case 'findOne':
          result = await userModel.findById(id);
          break;

        case 'updateOne':{

          const existingUserInfo = await userModel.findById(id);

          Object.keys(req.body).forEach(key => {
            existingUserInfo[key]=req.body[key];
          });

          result = await existingUserInfo.save();

          break;
        }

        case 'updatePassword': {
          const existingUserInfo = await userModel.findById(id);
          existingUserInfo.password = req.body.password;
          result = await existingUserInfo.save();
          break;
        }

        case 'delete':
          result = await userModel.findByIdAndDelete(id);
      }

      // remove the password for a response other than array from findAll
      if (!Array.isArray(result)) {
        result.password = undefined;
      }

      res.json(result);
    }
    catch (err){
      next(err);
    }
  };
}

const getAll = handlerGenerator('findAll');
const getOne = handlerGenerator('findOne');
const updateOne = handlerGenerator('updateOne');
const updatePassword = handlerGenerator('updatePassword');
const deleteOne = handlerGenerator('delete');


module.exports = {signup, signin, verifyOne, getAll, getOne, updateOne, updatePassword, deleteOne};
