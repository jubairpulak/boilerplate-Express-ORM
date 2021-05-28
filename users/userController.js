"use strict"
const dot = require('dot-object');
const bcryptjs = require("bcryptjs")

const _ = require("lodash")
const catchAsync = require("../error/catchAsync");
const AppError = require("../error/appError");
// const {checkValidation} = require("../services/validationService")

const ValidationCheck = require("../services/validationUsingClass");
const AuthService = require("../services/authService");
const UserModel = require("../users/userModel")

const {createToken} = require("../util/tokenRelated")
const SendErrorResponse = (errorMessage, statusCode, next) => {
	next(new AppError(errorMessage, statusCode));
};

exports.validationAndSignUp = catchAsync(async (req, res, next) => {
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.firstname,
		"First Name"
	)
		.IsEmpty()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.lastname,
		"Last Name"
	)
		.IsEmpty()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkconfirmPassword and validity
	const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
		req.body.confirmpassword,
		"Confirm Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.IsPasswordMatched(req.body.password)
		.print();
	if (IsConfirmPasswordNotValidandNotMatched)
		return SendErrorResponse(
			IsConfirmPasswordNotValidandNotMatched,
			400,
			next
		);
	
	//checkemail
	const IsEmailValid = new ValidationCheck(req.body.email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

 
  const UserSignUp =await new AuthService(UserModel).SignUp(req.body)
  

  if(UserSignUp.error === true){
         return next(new AppError(UserSignUp.ErrorMessage, UserSignUp.code))

  }
  else{
	  console.log("UserSignUp.data._id :" , UserSignUp.data.userid)
    res.status(201).json({
      status: "success",
      message : "Account registered",
      token : createToken(UserSignUp.data.userid, req, res),
      
    })
  }  
});

exports.validationAndLogin =catchAsync(async(req, res, next)=>{
	const IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print()
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	const UserLogin = await new AuthService(UserModel).Login(req.body)
	if(UserLogin.error === true) return next(new AppError(UserLogin.notfoundmessage, UserLogin.code))
	
	else{
		res.status(201).json({
		  status: "success",
		  message : "Login Successfully",

		  token : createToken(UserLogin.data.id, req, res),
		 user :{
			 UserLogin
		 } 
		})
	  }  

}
)

exports.getMyProfile = catchAsync(async(req, res, next)=>{

	console.log("user id from profie :", req.user.userid)
	const getProfile = await new AuthService(UserModel).findMe(req.user.userid)

	console.log(getProfile)
	res.status(201).json({
		getProfile
	})
})


exports.userrole = (...restrictedTo) => catchAsync(async(req, res ,next)=>{
	console.log( "data user",req.user.userid)
	const getUserRole = await new AuthService(UserModel).findUserWithRole(req.user.userid, restrictedTo, "lastname" )
 
	getUserRole ? next() : res.status(403).send("You are not allowed")
	
})


exports.getallUsers = catchAsync(async(req, res, next)=>{
	const getUserList = await new AuthService(UserModel).getAllData();

	let adminlist   =[]
	let userlist = []
	getUserList.map((value, index) =>{
		value.role === 'admin' ? adminlist.push(value) : userlist.push(value)
	})

	res.status(201).json({
		totals : getUserList.length,
		data:{
			alladmins:{
				totaladmin : adminlist.length,
				adminlist
			},
			allusers:{
				totaluser : userlist.length,
				userlist
			}
		}
	})
})

exports.updateUserName = catchAsync(async(req, res, next) => {

	
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.firstname,
		"First Name"
	)
		.IsEmpty()
		.IsString()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.lastname,
		"Last Name"
	)
		.IsEmpty()
		.IsString()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);
		const finaldata = _.pick(req.body, ["firstname", "lastname"])

	const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid,req.body,finaldata)
		
		
	  

	console.log(req.body)
	res.status(201).json({
		status : "success",
		message : "Data Update Successfully",
		data :{
			UpdateallThese
		}
	})
})

exports.updateParentsInfo = catchAsync(async (req, res, next)=>{
	const {father_Name , mother_Name} = req.body.parents_Info
       const IsFatherNameNotValid = new ValidationCheck(father_Name, "Father Name").IsEmpty().print()
		if(IsFatherNameNotValid) return SendErrorResponse(IsFatherNameNotValid, 400, next)
	  
		const IsMotherNameNotValid = new ValidationCheck(mother_Name, "Mother Name").IsEmpty().print()
		if(IsMotherNameNotValid)  return SendErrorResponse(IsMotherNameNotValid, 400, next)

		
		
		const objbeforedot = _.pick(req.body, ["parents_Info.father_Name"])
		const finaldata = dot.dot(objbeforedot)
		const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid, finaldata)


		res.status(201).json({
			status : "success",
			message : "Profile Name Updated Successfully",
			data :{
				UpdateallThese
			}
		})
	

})

exports.updateContractInfo = catchAsync(async (req, res, next)=>{
		//phoneField CHeck
		console.log("body data " , req.body.contract_Info.phone_Number)
		const IsPhoneNumberValid = new ValidationCheck(
			req.body.contract_Info.phone_Number,
			"Phone_Number"
		)
			.IsEmpty()
			.IsString()
			.IsLowerThanMin(11)
			.IsLargerThanMax(12)
			.print();
		if (IsPhoneNumberValid)
			return SendErrorResponse(IsPhoneNumberValid, 400, next);


			
		const objbeforedot = _.pick(req.body, ["contract_Info.phone_Number"])
		const finaldata = dot.dot(objbeforedot)
		const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid, finaldata)


		res.status(201).json({
			status : "success",
			message : "Contract Information updated Successfully",
			data :{
				UpdateallThese
			}
		})
	

})
exports.updatePassword = catchAsync(async (req, res, next)=>{
		

	const IsCurrentPassworNotValid = new ValidationCheck(
		req.body.currentPassword,
		"Current Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsCurrentPassworNotValid)
		return SendErrorResponse(IsCurrentPassworNotValid, 400, next);
    
		const checkcurrentPassword = await new AuthService(UserModel).checkCurrentPassword(req.user.userid, req.body.currentPassword)
        console.log("wrong info :", checkcurrentPassword)
		if(checkcurrentPassword.error === true) return next(new AppError(checkcurrentPassword.notfoundmessage, checkcurrentPassword.code))

		//checkpassword
		const IsPasswordNotValid = new ValidationCheck(
			req.body.password,
			"Password"
		)
			.IsEmpty()
			.IsLowerThanMin(6)
			.print();
		if (IsPasswordNotValid)
			return SendErrorResponse(IsPasswordNotValid, 400, next);
	
		//checkconfirmPassword and validity
		const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
			req.body.confirmPassword,
			"Confirm Password"
		)
			.IsEmpty()
			.IsPasswordMatched(req.body.password)
			.print();
		if (IsConfirmPasswordNotValidandNotMatched)
			return SendErrorResponse(
				IsConfirmPasswordNotValidandNotMatched,
				400,
				next
			);

			req.body.password = await bcryptjs.hash(req.body.password, 12)
	
		const finaldata = _.pick(req.body, ["password"])
		const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid, finaldata)


		res.status(201).json({
			status : "success",
			message : "Password updated Successfully",
			data :{
				UpdateallThese
			}
		})
	

})

exports.MakeDeactive = catchAsync( async (req, res, next)=>{

	const DeactiveUser = await new AuthService(UserModel).updateRole(req.user.userid)
	res.cookie('jwt',  "loggedout",{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
       
    })

	res.status(201).json({
		status : "success",
		message : DeactiveUser
		
	})
})

exports.MakeActive = catchAsync(async(req, res, next)=>{
 
	const updateStatus = {active : true}
	
	const UpdateAccont = await new AuthService(UserModel).updateRequest(req.body.email, updateStatus)

	res.status(201).json({
		status : "success",
		message : UpdateAccont
		
	})
})
exports.updateRole = catchAsync(async(req, res, next)=>{

	const updateRole = {role : "admin"}

	//checkemail
	const IsEmailValid = new ValidationCheck(req.body.email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

 

	
	const UpdateAccont = await new AuthService(UserModel).updateRequest(req.body.email, updateRole)

	res.status(201).json({
		status : "success",
		message : "The role has been updated successfully"
		
	})
})



exports.logoutUser = catchAsync(async (req, res, next)=>{
	res.cookie('jwt',  "loggedout",{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
       
    })

    res.status(201).json({status : "success", message : "You have logged out"})
})