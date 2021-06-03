"use strict"

const catchAsync = require("../error/catchAsync");
const config = require("../config")
const JWT = require("jsonwebtoken")
const {promisify} = require("util")
const UserModel = require("../users/userModel");

exports.userauthorization = catchAsync(async (req, res, next) =>{

    const {token_Secret} = config.token
    let token;
   
  if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
     token =  req.headers.authorization.split(' ')[1]
  }
  console.log("hey token",token)

  const decodeToken =await promisify(JWT.verify)(token,  token_Secret);

    
  req.user = decodeToken
  const {  userid  } = req.user;;
  req.userdata = await UserModel.findByPk(  userid  );

  console.log("user data :", req.user);
  next()
})
