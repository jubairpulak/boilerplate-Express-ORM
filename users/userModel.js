

const Sequelize = require("sequelize")
const sequelize = require("../config/dbConnection")

const User = sequelize.define("usertable", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true        
    },
    firstname :{
        type : Sequelize.STRING,
        allowNull : false,
    },
    lastname :{
        type : Sequelize.STRING,
        allowNull : false,
    },

    password: {
        type : Sequelize.STRING,
        allowNull : false,
        validate:{
            min : {
                args : 6,
                "msg" : "Password length should not be less then 6"
            }
        }
    },


    email:{
        type : Sequelize.STRING,
        allowNull : false,
        unique : true,
        validate :{
            isEmail:{
                args : true,
                "msg" : "Email is not correct"
            },
             
        }
    },
    active :{
        type : Sequelize.BOOLEAN,
        defaultValue : true
    },
    role :{
        type : Sequelize.STRING,
        defaultValue : "user"
    }


} )

module.exports = User