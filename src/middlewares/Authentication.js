const { getAuth } = require("firebase-admin/auth");
const { User } = require("../models");

/**
 * @desc      Middleware for user authentication
 * @route     -
 * @access    Private
 */
exports.protection = async (req, res, next) => {
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
		console.error(error);
		let message,
			errorCode = error.code || 500;
		message = res.getErrorFirebase(errorCode);

		return res.sendJson(403, false, message, {});
	}
};
