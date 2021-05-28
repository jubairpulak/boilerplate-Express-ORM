"use strict"
const express = require('express')

const pkginfo = require('pkginfo')(module, 'license', 'author', 'name')

const {errors}= require("celebrate")

const config = require("./config")
// const { logger } = require("./logger");
const AppError = require("./error/appError")
const logger = require('morgan')
const GlobalErrorHandler = require("./error/globalErrorController")
const rfs = require('rotating-file-stream');
const {join} = require("path")
var path = require('path');
const app = express()
const UserRouter = require("./users/userRouter")
const globalErrorController = require('./error/globalErrorController')
app.use(logger('common'));
app.use(
  logger('combined', {
    stream: rfs.createStream(
      `${module.exports.name}-${new Date()
        .toISOString()
        .replace(/T.*/, '')
        .split('-')
        .reverse()
        .join('-')}.log`,
      {
        interval: '1d',
        path: join(__dirname, 'log'),
      },
    ),
  }),
);


const {env} = config.server

if(env === 'development'){
    app.use(logger('dev'))
}




app.use(express.json())





app.use("/api", UserRouter)



app.all("*", (req, res, next) => {
	next(new AppError(`Can't Found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController)

module.exports = app
