"use strict"

const bcryptjs = require("bcryptjs")
const comparePass =  (storepass, inputpass) => bcryptjs.compare(inputpass, storepass)


class AuthService  {
    constructor(Model){
        this.Model = Model;
    }

    async SignUp(DatafromBody){
        const {firstname, lastname, password, email} = DatafromBody
        const CheckIsEmailExist = await this.Model.findOne({where : {email}})
        if(CheckIsEmailExist){
           return {
               ErrorMessage : "Email has already been used", code : 403, error : true
           }
        }
        
        else{

            const createUser = await this.Model.create({
               firstname,
               lastname,
               password : await bcryptjs.hash(password, 12),
               email,
                
            })
            return {
                error : false,
                 data : {
                     userid : createUser.id
                 }
            };
        } 
}

async Login(DatafromBody) {
    const {email, password} = DatafromBody;  
    const findemail = await this.Model.findOne({where : {email}})
    if(!findemail ) {
        return {
        notfoundmessage : "Email not found", code : 404, error : true
    }}
    const IspasswordMatched =await comparePass(findemail.password, password)
    if(!IspasswordMatched) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
    const checkActive = await this.Model.findOne({
        where :{
            id : findemail.id,
            active : true
        }
    })
    if(!checkActive){
        return {
            notfoundmessage : "Account is deactivated", code : 403, error : true
        }
    }
    return {
        error : false,
        data : findemail
    }
}

async findMe(userid){
    return await this.Model.findByPk(userid)
}

async findUserWithRole(userid , role, variablename){
    let data = variablename;

    console.log("user id : ", userid)
    const findUser = await this.Model.findByPk(userid)
    console.log("user info",findUser)
      const v1 = findUser[data]
      console.log("what is this?",v1)
    return !(role.includes(findUser.role)) ? false: true
}
async getAllData(){
    return await this.Model.findAll()
}

async checkCurrentPassword(userid, currentPassword){

    const findUser = await this.Model.findByPk( userid)
    const passwordCheck =await comparePass(findUser.password, currentPassword)
    if(!passwordCheck) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
return ""
}

async updateInfo(userid, updateobjectdata){


   const updatedata = await this.Model.update(updateobjectdata,{ where :{id : userid}})
   
return  this.Model.findByPk(updatedata[0])
}

async updateRole(userid){
    const updateUserActiveRole = await this.Model.update({active: false}, {where:{id :userid}})

    if(!updateUserActiveRole) console.log("No, something wrong")
    
    return "Account has been deactivated successfully"
}

async updateRequest(email, updateField){
  
    console.log("update field data :",Object.keys(updateField))
    // const updateUserActiveRole = await this.Model.findOne({"contract_Info"})
    const updateUserActiveRole = await this.Model.update(updateField, {where : {email : email}})  
    if(!updateUserActiveRole) console.log("Account has not been updated")  
    return "Account has been Updated"
}
}

 

module.exports = AuthService
