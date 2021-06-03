"use strict"

const dotenv = require("dotenv")
 dotenv.config({path:'./config/.env'})

const http = require('http')

process.on('uncaughtException', err =>{
    console.log(err)
    console.log(err.name , err.message);
    console.log("Unhandler Rejection ! Shutting down...")
    process.exit(1)
    
})
const config = require("./config")
var app = require("./app")
const sequelize = require("./config/dbConnection");

const {port} = config.server
// const {token_Secret, token_Expires} = config.token



sequelize
	.sync()
	.then((result) => {
		

        app.set('port', port)

const server = http.createServer(app)

const serverdata = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

process.on('unhandledRejection', err =>{
    console.log(err.name , err.message);
    console.log("Unhandler Rejection ! Shutting down...")
    serverdata.close(()=>{

        process.exit(1)
    });
})

	})
	.catch((err) => console.log(err));
console.log("your port is ", port)
// console.log("your Token Secret is ", token_Secret, token_Expires)



