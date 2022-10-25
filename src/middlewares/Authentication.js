const {
	User,
	Lecturer,
	Student,
	Subject,
	Session,
	StudentSubject,
	Major,
	Quiz,
	MaterialEnrolled,
} = require("../models");
const { MODULE } = process.env;
const { getAuth } = require("firebase-admin/auth");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const lockUpdate = require("../helpers/lockHelp");
const getSession = require("../helpers/getSession");

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
		let student_id;

		const currentUserRole = await Promise.all([
			User.findOne({ where: { id: req.userData.id } }),
			Lecturer.findOne({ where: { user_id: req.userData.id } }),
			Student.findOne({ where: { user_id: req.userData.id } }),
		]).then((values) => {
			let userRoles = [];

			if (values[0] !== null) userRoles.push("user");
			if (values[1] !== null) userRoles.push("lecturer");
			if (values[2] !== null) {
				userRoles.push("student");
				student_id = values[2].id;
			}

			return userRoles;
		});

		let role = "not registered";
		if (currentUserRole.includes("lecturer")) {
			role = "lecturer";
		} else if (currentUserRole.includes("student")) {
			role = "student";
		} else if (currentUserRole.includes("user")) {
			role = "guest";
		}

		if (!currentUserRole.includes(...roles)) {
			return next(
				new ErrorResponse(`Not authorized to access this route`, 401)
			);
		}

		req.student_id = student_id;
		req.role = role;
		next();
	});
};

exports.enrolled = (Model) => {
	return asyncHandler(async (req, res, next) => {
		let enrolled;
		switch (Model) {
			case Session: {
				let { session_id } = req.params;
				const subject_id = await Session.findOne({
					attributes: ["subject_id"],
					where: {
						id: session_id,
					},
				});
				enrolled = await Student.findOne({
					attributes: ["id"],
					where: {
						id: req.student_id,
					},
					include: {
						model: Subject,
						attributes: ["id"],
						where: {
							id: subject_id.subject_id,
						},
					},
				});
				break;
			}
			case Subject: {
				let { subject_id } = req.params;
				enrolled = await Student.findOne({
					attributes: ["id"],
					where: {
						id: req.student_id,
					},
					include: {
						model: Subject,
						attributes: ["id"],
						where: {
							id: subject_id,
						},
					},
				});
				break;
			}
			case Major: {
				let { subject_id } = req.params;

				enrolled = await Student.findOne({
					attributes: ["id"],
					where: {
						id: req.student_id,
					},
					include: {
						model: Major,
						attributes: ["id"],
						through: {
							attributes: [],
						},
						include: {
							model: Subject,
							attributes: ["id"],
							through: {
								attributes: [],
							},
							where: {
								id: subject_id,
							},
						},
					},
				});
				enrolled = enrolled.Majors.length === 0 ? false : true;
				break;
			}
			case Quiz: {
				enrolled = getSession(Quiz, req.params.quiz_id);
				break;
			}
		}
		if (!enrolled) {
			return next(new ErrorResponse(`Student is not authorized`, 401));
		}

		next();
	});
};

exports.existence = (Model) => {
	return asyncHandler(async (req, res, next) => {
		let id;
		switch (Model) {
			case Quiz: {
				id = req.params.quiz_id;
				break;
			}
			case Major: {
				id = req.params.major_id;
				break;
			}
			case Session: {
				id = req.params.session_id;
				break;
			}
			case Subject: {
				id = req.params.subject_id;
				break;
			}
			case StudentSubject: {
				id = req.params.subject_id;
				const student_id = req.student_id;
				const existence = await Model.findOne({
					where: {
						subject_id: id,
						student_id: student_id,
					},
				});
				if (!existence) {
					return next(new ErrorResponse(`ID not found`, 404));
				}
				return next();
			}
		}
		const existence = await Model.findOne({
			where: {
				id,
			},
		});
		if (!existence) {
			return next(new ErrorResponse(`ID not found`, 404));
		}

		next();
	});
};

exports.moduleTaken = (Model) => {
	return asyncHandler(async (req, res, next) => {
		let id, allowed;
		switch (Model) {
			case Session: {
				id = req.params.session_id;
				allowed = await lockUpdate(req.student_id, id);
				break;
			}
		}
		if (allowed) {
			return next(new ErrorResponse(`Module not taken`, 404));
		}
		next();
	});
};
