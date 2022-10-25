const { User } = require("../models");
const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");
const Sequelize = require("sequelize");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	/**
	 * @desc      Get User Login Data (Profile)
	 * @route     GET /api/v1/profile/me
	 * @access    Private
	 */
	getMe: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;
		let user = req.userData;

		const data = await User.findOne({
			where: {
				firebase_uid: user.firebase_uid,
			},
			attributes: {
				exclude: ["id", "firebase_uid", "password", "deleted_at", "updated_at"],
			},
		});

		let student_id = "Not a STUDENT";

		if (req.role === "student") {
			student_id = req.student_id;
		}

		return res.status(200).json({
			success: true,
			message: "Account connected.",
			data: { ...data.dataValues, role: req.role, student_id: student_id },
		});
	}),

	/**
	 * @desc      Get User's Achievements
	 * @route     GET /api/v1/profile/achievement
	 * @access    Private
	 */
	achievements: asyncHandler(async (req, res) => {
		let student_id = req.student_id;
		const subject_count = await Student.findOne({
			where: {
				id: student_id,
			},
			include: {
				model: Subject,
				attributes: [Sequelize.fn("COUNT", Sequelize.col("id")), ""],
			},
		});
	}),

	/**
	 * @desc      Update User Login Data (Profile)
	 * @route     PUT /api/v1/profile/me
	 * @access    Private
	 */
	updateMe: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;
		let user = req.userData;
		const storage = getStorage();

		const { full_name, gender, phone, address } = req.body;

		if (req.file) {
			const getFile = await User.findOne({
				where: {
					id: user.id,
				},
			});

			if (getFile.display_picture) {
				deleteObject(ref(storage, getFile.display_picture));
			}

			const bucket = admin.storage().bucket();
			const displayPictureFile =
				"images/profile/" +
				uuidv4() +
				"-" +
				req.file.originalname.split(" ").join("-");
			const displayPictureBuffer = req.file.buffer;

			bucket
				.file(displayPictureFile)
				.createWriteStream()
				.end(displayPictureBuffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, displayPictureFile)).then(
						async (linkFile) => {
							await User.update(
								{
									display_picture_link: linkFile,
									display_picture: displayPictureFile,
								},
								{
									where: {
										id: user.id,
									},
									returning: true,
									plain: true,
								}
							);
						}
					);
				});
		}

		let data = await User.update(
			{
				full_name: titleCase(full_name),
				gender,
				phone,
				address,
			},
			{
				where: {
					id: user.id,
				},
				returning: true,
				plain: true,
			}
		);

		delete data[1].dataValues["id"];
		delete data[1].dataValues["firebase_uid"];
		delete data[1].dataValues["password"];

		await updateProfile(getClientAuth(), {
			full_name: titleCase(full_name),
		});

		return res.sendJson(200, true, "success update profile");
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
		return false;
	}
}

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};
