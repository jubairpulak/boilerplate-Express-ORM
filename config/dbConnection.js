"use strict";

// const mysql = require("mysq");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv")
dotenv.config({ path: "../.config" });
const catchAsync = require("../error/catchAsync");



const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{ dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;