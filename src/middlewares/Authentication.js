const { User, Lecturer, Student } = require("../models");
const { getAuth } = require("firebase-admin/auth");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");

/**
 * @desc      Middleware for user authentication
 * @route     -
 * @access    Private
 */
exports.protection = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token || token == undefined)
		return res.status(409).json({
			success: false,
			message: "Invalid authorization.",
			data: {},
		});

	try {
		const user = await getAuth().verifyIdToken(token);

		if (!user) return next(new ErrorResponse(`Invalid authorization.`, 409));

		const userData = await User.findOne({
			where: { firebase_uid: user.uid },
		});

		req.firebaseToken = token;
		req.firebaseData = user;

		if (userData) req.userData = userData.dataValues;

		next();
	} catch (error) {
		next(new ErrorResponse(error, 401));
	}
});

exports.authorize = (...roles) => {
	return asyncHandler(async (req, res, next) => {
		const currentUserRole = await Promise.all([
			User.findOne({ where: { id: req.userData.id } }),
			Lecturer.findOne({ where: { id: req.userData.id } }),
			Student.findOne({ where: { id: req.userData.id } }),
		]).then((values) => {
			let userRoles = [];

			if (values[0] !== null) userRoles.push("user");
			if (values[1] !== null) userRoles.push("lecturer");
			if (values[2] !== null) userRoles.push("student");

			return userRoles;
		});

		if (!roles.includes(...currentUserRole)) {
			return next(
				new ErrorResponse(`Not authorized to access this route`, 401)
			);
		}

		let role = "not registered";
		if (currentUserRole.includes("lecturer")) {
			role = "lecturer";
		} else if (currentUserRole.includes("student")) {
			role = "student";
		} else if (currentUserRole.includes("user")) {
			role = "guest";
		}
		req.role = role;

		next();
	});
};
