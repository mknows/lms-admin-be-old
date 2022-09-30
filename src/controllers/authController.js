const { User, Nrus, Daus, User_Activity } = require("../models");
const { Op } = require("sequelize");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const os = require("os");

const {
	getAuth: getClientAuth,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	updateProfile,
} = require("firebase/auth");

const admin = require("firebase-admin");

module.exports = {
	/**
	 * @desc      Register Account
	 * @route     POST /api/v1/auth/register
	 * @access    Public
	 */
	createUser: asyncHandler(async (req, res) => {
		const { full_name, email, password, gender } = req.body;

		const credential = await createUserWithEmailAndPassword(
			getClientAuth(),
			email,
			password
		);

		await updateProfile(credential.user, {
			displayName: titleCase(full_name).trim(),
			emailVerified: false,
		});

		const created = await User.create({
			firebase_uid: credential.user.uid,
			full_name,
			email,
			gender,
		});

		await defaultUsernameFromEmail(created);

		await insertLogActivity(
			req,
			created.dataValues.id,
			"Register with Email and Password"
		);

		insertLog("new-register-user", created.dataValues.id);

		const user = getClientAuth().currentUser;

		await sendEmailVerification(user);

		return res.sendJson(
			201,
			true,
			"Register success. Please verify your email by click verification link at your mail inbox.",
			{
				full_name: created.dataValues.name,
				email: created.dataValues.email,
			}
		);
	}),

	/**
	 * @desc      Login Account Using Email and Password
	 * @route     POST /api/v1/auth/login
	 * @access    Public
	 */
	loginUser: asyncHandler(async (req, res) => {
		const { email, password } = req.body;

		const auth = getClientAuth();
		const credential = await signInWithEmailAndPassword(auth, email, password);

		// NOTE: check email verified in firebase
		if (credential.user.emailVerified == false) {
			return res.sendJson(
				401,
				false,
				"sorry, please verify your email address"
			);
		}

		const dataPostgre = await User.findOne({
			where: { email },
		});

		if (!dataPostgre) {
			return res.sendJson(
				401,
				false,
				"sorry, your account is not in the database"
			);
		}

		await insertLogActivity(
			req,
			dataPostgre.dataValues.id,
			"Login with Email and Password"
		);

		const token = await auth.currentUser.getIdToken();

		return res.sendJson(
			200,
			true,
			`Login success. Hi ${credential.user.displayName}!`,
			{ token },
			{
				name: "token",
				value: token,
			}
		);
	}),

	/**
	 * @desc      request forgot password user, send email link to user
	 * @route     POST /api/v1/auth/forget-password
	 * @access    Public
	 */
	requestResetPassword: asyncHandler(async (req, res) => {
		const { email } = req.body;

		const checkEmail = await User.findOne({
			where: {
				email,
			},
		});

		if (!checkEmail) {
			return res.sendJson(404, false, "sorry user not found");
		}

		await sendPasswordResetEmail(getClientAuth(), email);

		return res.sendJson(
			200,
			true,
			"Reset Password email has been sent. Please check your mail inbox to reset your password.",
			{}
		);
	}),

	/**
	 * @desc      request verify email, send email link to user
	 * @route     POST /api/v1/auth/verify-email
	 * @access    Public
	 */
	requestVerificationEmail: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;

		if (!token)
			return res.status(409).json({
				success: false,
				message: "Invalid authorization.",
				data: {},
			});

		const user = getClientAuth().currentUser;

		if (!user)
			return res.status(409).json({
				success: false,
				message: "Invalid authorization.",
				data: {},
			});

		if (user.emailVerified)
			return res.status(400).json({
				success: false,
				message: "This email already verified.",
				data: {},
			});

		await sendEmailVerification(user);

		return res.sendJson(
			200,
			true,
			"Email verification sent. Please check your email inbox.",
			{}
		);
	}),

	/**
	 * @desc      Login With Google
	 * @route     POST /api/v1/auth/google-validate
	 * @access    Public
	 */
	googleValidate: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;
		let firebaseData = req.firebaseData;
		let user = req.userData;

		if (!token || !firebaseData)
			return res.status(409).json({
				success: false,
				message: "Invalid authorization.",
				data: {},
			});

		const { email, name, uid } = firebaseData;

		if (!user) {
			user = await User.create({
				firebase_uid: uid,
				full_name: name,
				email,
				gender: 0,
			});

			user = user.dataValues;

			await defaultUsernameFromEmail(user);

			insertLog("daily-active-user", user.id);
		} else insertLog("daily-active-user", user.id);

		insertLogActivity(req, user.id, "Login with Google");

		delete user["id"];
		delete user["firebase_uid"];
		delete user["password"];
		delete user["deleted_at"];
		delete user["created_by"];
		delete user["updated_by"];

		res.status(200).json({
			success: true,
			message: "Account connected.",
			data: { ...user },
		});
	}),

	/**
	 * @desc      delete all user
	 * @route     GET /api/v1/auth/verify-email
	 * @access    Public
	 */
	deleteAllFirebaseUser: asyncHandler(async (req, res) => {
		const { users } = await admin.auth().listUsers(1000);

		users.map(async (user) => {
			// KODE HARAM
			await admin.auth().deleteUser(user.uid);
		});

		return res.json({ users });
	}),

	signOutUser: asyncHandler(async (req, res) => {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
		});

		res.status(200).json({
			success: true,
			message: "Logout success.",
			data: {},
		});
	}),
};

// Usage for Capitalize Each Word
function titleCase(str) {
	var splitStr = str.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}

	return splitStr.join(" ");
}

// Usage for Phone Number Validator (Firebase) (Example: +62 822 xxxx xxxx)
function phoneNumber(number) {
	var validationPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	if (number.value.match(validationPhone)) {
		return true;
	} else {
		alert("message");
		return false;
	}
}

// Usage for Insert Log Activity
const insertLogActivity = asyncHandler(async (req, userId, activity) => {
	await User_Activity.create({
		user_id: userId,
		activity,
		ip_address: req.headers["x-real-ip"] || req.connection.remoteAddress,
		referrer: req.headers.referrer || req.headers.referer,
		device: req.device.type,
		platform: os.platform() || req.useragent.platform,
		operating_system: `${req.useragent.browser} ${req.useragent.version}`,
		source: req.useragent.source,
	});

	return true;
});

// Usage for Insert Log
const insertLog = asyncHandler(async (type, userId) => {
	switch (type) {
		case "new-register-user":
			await Nrus.create({
				user_id: userId,
			});

			break;
		case "daily-active-user":
			const TODAY_START = new Date().setHours(0, 0, 0, 0);
			const NOW = new Date();

			let existDaus = await Daus.findOne({
				where: {
					user_id: userId,
					created_at: {
						[Op.gt]: TODAY_START,
						[Op.lt]: NOW,
					},
				},
			});

			if (!existDaus)
				await Daus.create({
					user_id: userId,
				});

			break;
		default:
			break;
	}

	return true;
});

async function defaultUsernameFromEmail(user) {
	let userId = user.id;
	let username = user.email.split("@")[0].split(".").join("");
	const added_id = user.id.split("-")[1];
	username = username.concat(added_id);

	const current_user = await User.update(
		{
			username,
		},
		{
			where: {
				id: userId,
			},
		}
	);
	return current_user;
}
