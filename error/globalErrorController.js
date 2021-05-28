"use strict"
const config = require('../config');
const AppError = require("./appError")
const {env} = config.server


const handleCastErrorDB = (err) =>{
  const message = `Invalid ${err.path} : ${err.value}`

  return new AppError(message, 400)
}


const handleDuplicateDB = (err) =>{
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const message = `Duplicate Field value : ${value}`
  return new AppError(message, 400)

}
const handleValidationError = (err) =>{
  // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid Input data ${errors.join('. ')}`

  
  return new AppError(message, 400)

}
const handleJsonWebTokenError = (err) =>{

  const message = "Plese Login to access this service"

  
  return new AppError(message, 400)

}

const sendErrorDev = (err, res) =>{

 return res.status(err.statusCode).json({
    status : err.status,
    message : err.message,
    stack : err.stack,
    error : err,
  })
}

const sendErrorProd = (err, res) =>{

  if(err.isOperational){
     res.status(err.statusCode).json({
       status : err.status,
       message : err.message,
      
     }) 

     //for unknown
  }else{

    console.error("Error", err)


     res.status(500).json({
      status : "error",
      message : "Something went very wrong",
     
    }) 
  }
}



module.exports = (err, req, res, next)=>{
    console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
  

    if(env=== 'development'){
        sendErrorDev(err, res)
    }else if(env === 'production'){

     
      let error = {...err}
      error.message = err.message

      if(error.name === 'CastError'){
              
       error =  handleCastErrorDB(error)
      }
      if(error.code === 11000){
              
       error =  handleDuplicateDB(error)
      }
      if(error.name === 'ValidationError'){
              
       error =  handleValidationError(error)
      }
      if(error.name === 'JsonWebTokenError'){
        error = handleJsonWebTokenError(error)
      }


     sendErrorProd(error, res)
    }

    next()
    
  }