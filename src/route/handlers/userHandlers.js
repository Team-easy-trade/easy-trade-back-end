'use strict';

const userModel = require('../../model/user.js');
const base64 = require('base-64');

async function signup (req, res, next){
  const uniqueError = { 'message_spec': 'Username taken, please choose another one', 'statusCode': 409, 'statusMessage': 'Unique Fail' };
  
  try {
    const user = new userModel(req.body);
    const valid = await userModel.findOne({username: user.username});
    if(!valid){
      try{
        const savedUser = await user.save();
        const token = savedUser.tokenGenerator();
        res.status(200).send({token});
      } catch (error) {
        next(error);
      }
    } else {
      next(uniqueError);
    }
  }
  catch (err){
    next(err);
  }
}

async function signin (req, res, next){
  const user = {
    id: req.user._id,
    username: req.user.username,
    role: req.user.role,
  };
  res.send({
    token: req.token,
    user,
  });
}

async function signinV2 (req, res, next){
  const invalidErr = { 'message_spec': 'Invalid username or password. Please try again.', 'statusCode': 401, 'statusMessage': 'Unauthenticated' };

  try{
    const basic = req.headers.authorization.split(' ').pop();
    const [username, password] = base64.decode(basic).split(':');
    const validUser = await userModel.basicValidation(username, password);
    
    if (validUser) {
      const token = validUser.tokenGenerator();
      res.status(200).send({token});
    } else {
      next(invalidErr);
      return;
    }
  }
  catch (err) {
    next(invalidErr);
  }
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


module.exports = {signup, signin, signinV2, verifyOne, getAll, getOne, updateOne, updatePassword, deleteOne};
