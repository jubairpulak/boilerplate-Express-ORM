"use strict"

class ValidationCheck{

    constructor(variable, variableName){
        this.variable = variable
        this.variableName = variableName ? variableName : "Data"
        this.message = []
    }
    IsString(){
        if(!( typeof this.variable === "string")){
           
           this.message.push(`${this.variableName} field must be String`)
        }

        return this
    }
    IsEmpty(){
        if(this.variable === undefined || this.variable === null || this.variable === ""){
            
             this.message.push(`${this.variableName} field must not empty`)
        }
           return this
        
    }
    IsNumber(){
        if(!(Number.isInteger(this.variable))){

             this.message.push(`${this.variableName} field must be Number`)
        }
        return this
        
    }

    IsEmail(){
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.variable)))
        {
            this.message.push(`${this.variableName} is not valid`)
        }
          return this
    }

    IsLowerThanMin(length){
        if(this.variable.length < length){
            this.message.push(`${this.variableName}'s length must not be less than ${length}`)

        }
        return this
    }
    IsLargerThanMax(length){
        if(this.variable.length > length){
            this.message.push(`${this.variableName}'s length must not be larger than ${length}`)

        }
        return this
    }
    IsPasswordMatched(password){
        console.log(password, " ===", this.variable)
        if(this.variable !== password){
            this.message.push(`Password and Confirm Password are not matched`)

        }
        return this
    }
    
    
    print(){
        return this.message.length > 0? this.message[0]: ""
        
    }
    
}

module.exports = ValidationCheck