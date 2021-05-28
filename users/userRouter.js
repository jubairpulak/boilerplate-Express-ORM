const express = require('express')

const router = express.Router()
const {
	validationAndSignUp,
	validationAndLogin,
	getMyProfile,
	userrole,
	getallUsers,
	updateUserName,

	updatePassword,
	MakeActive,
	MakeDeactive,
	logoutUser,

	updateRole,
} = require("./userController");

const {userauthorization} = require("../middleware/userMiddleware")

router.route("/signup").post(validationAndSignUp)
router.route("/login").post(validationAndLogin)
router.route("/get-me").get(userauthorization, getMyProfile)
router.route("/get-all").get(userauthorization, userrole("admin"), getallUsers )
router.route("/update-name").patch(userauthorization, updateUserName);
router.route("/update-password").patch(userauthorization,  updatePassword)
router.route("/deactive-me").patch(userauthorization, MakeDeactive);
router
	.route("/active-me")
	.patch(userauthorization, userrole("admin"), MakeActive);

router
	.route("/update-role")
	.patch(userauthorization, userrole("admin"), updateRole);
router.route("/logout").post(userauthorization, logoutUser)
module.exports =router