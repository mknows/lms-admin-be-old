const { User } = require("../models");
const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      Get User Login Data (Profile)
	 * @route     GET /api/v1/profile/me
	 * @access    Private
	 */
	getMe: asyncHandler(async (req, res) => {
		try {
			let token = req.firebaseToken;
			let user = req.userData;

			console.log(token, user);
			// delete user["firebase_uid"];

			const data = await User.findOne({
				where: {
					firebase_uid: user.firebase_uid,
				},
				attributes: {
					exclude: ["id", "firebase_uid", "password"],
				},
			});

			return res.status(200).json({
				success: true,
				message: "Account connected.",
				data: { ...data.dataValues },
			});
		} catch (error) {
			console.error(error);
			let message = res.getErrorFirebase(error.code);
			return res.sendJson(403, false, message, {});
		}
	}),

	/**
	 * @desc      Update User Login Data (Profile)
	 * @route     PUT /api/v1/profile/me
	 * @access    Private
	 */
	updateMe: asyncHandler(async (req, res) => {
		try {
			let token = req.firebaseToken;
			let user = req.userData;

			const { full_name, gender, phone, address } = req.body;

			if (req.file) {
				await User.update(
					{
						image: req.file.filename,
					},
					{
						where: {
							id: user.id,
						},
					}
				);
			}

			const data = await User.update(
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

			return res.status(200).json({
				success: true,
				message: "Profile updated.",
				data: { ...data[1].dataValues },
			});
		} catch (error) {
			console.error(error);
			let message = res.getErrorFirebase(error.code);
			return res.sendJson(403, false, message, {});
		}
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
