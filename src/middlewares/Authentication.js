const { User, Lecturer } = require("../models");
const { getAuth } = require("firebase-admin/auth");
<<<<<<< HEAD
const { User } = require("../models");
=======
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

/**
 * @desc      Middleware for user authentication
 * @route     -
 * @access    Private
 */
<<<<<<< HEAD
exports.protection = async (req, res, next) => {
	let token;
=======
exports.protection = asyncHandler(async (req, res, next) => {
  let token;
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

<<<<<<< HEAD
	if (!token || token == undefined)
		return res.status(409).json({
			success: false,
			message: "Invalid authorization.",
			data: {},
		});
=======
  if (!token || token == undefined) return next(new ErrorResponse("Invalid authorization.", 409));
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

	try {
		const user = await getAuth().verifyIdToken(token);

<<<<<<< HEAD
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
=======
    if (!user) return next(new ErrorResponse(`Invalid authorization.`, 409));

    const { dataValues } = await User.findOne({
      where: { firebase_uid: user.uid }
    });

    req.firebaseToken = token;
    req.firebaseData = user;
    req.userData = dataValues;

    next();
  } catch (error) {
    next(new ErrorResponse(error, 401));
    // let message = res.getErrorFirebase(error.code);
    // return res.status(403).json({
    //   success: false,
    //   message,
    //   data: {}
    // });
  }
});

exports.authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const currentUserRole = await Promise.all([
      User.findOne({ where: { id: req.userData.id } }),
      Lecturer.findOne({ where: { id: req.userData.id } }),
      // Student.findOne({ where: { id: req.userData.id } })
    ]).then(values => {
      let userRoles = [];

      if (values[0] !== null) userRoles.push("user");
      if (values[1] !== null) userRoles.push("lecturer");

      return userRoles;
    });

    if (!roles.includes(...currentUserRole)) return next(
      new ErrorResponse(`Not authorized to access this route`, 401)
    );

    next();
  });
};
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
