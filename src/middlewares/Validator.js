const { body, validationResult, param } = require("express-validator");

exports.validate = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
				body("password", "Password should be at least 5 characters")
					.notEmpty()
					.isLength({ min: 5 }),
				body("full_name", "Full Name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("gender", "Gender is invalid")
					.notEmpty()
					.trim()
					.isIn([0, 1, 2, 9]),
			];
		}

		case "loginUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
				body("password", "Password is required").notEmpty().trim(),
			];
		}

		case "forgetPasswordUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
			];
		}

		case "updateDataUser": {
			return [
				body("full_name", "Full Name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("gender", "Gender is invalid")
					.notEmpty()
					.trim()
					.isIn([0, 1, 2, 9]),
			];
		}

		case "administrationBiodata": {
			return [
				body("full_name", "Invalid full name")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("email", "Invalid email").notEmpty().isEmail().trim(),
				// body("nin", "Invalid nin").notEmpty().trim(),
				// body("study_program", "Invalid study program / major").notEmpty(),
				body("semester", "Invalid semester").notEmpty().trim(),
				// body("education", "Invalid education").notEmpty(),
				body("nin_address", "Invalid nin address").notEmpty(),
				// body("residence_address", "Invalid residence address").notEmpty(),
				body("birth_place", "Invalid birth place").notEmpty(),
				body("birth_date", "Invalid birth date").notEmpty(),
				body("phone", "Invalid phone").notEmpty().trim(),
				body("gender", "Invalid gender").notEmpty().trim().isIn([0, 1, 2, 9]),
			];
		}

		case "administrationFamilial": {
			return [
				body("father_name", "Invalid father name").notEmpty(),
				body("father_occupation", "Invalid father occupation").notEmpty(),
				body("father_income", "Invalid father income").notEmpty().trim(),

				body("mother_name", "Invalid mother name").notEmpty(),
				body("mother_occupation", "Invalid mother occupation").notEmpty(),
				body("mother_income", "Invalid mother income").notEmpty().trim(),

				body("occupation", "Invalid occupation").notEmpty(),
				body("income", "Invalid income").notEmpty().trim(),
				body("living_partner", "Invalid living partner").notEmpty(),
			];
		}

		case "administrationDegree": {
			return [body("degree", "Invalid degree").notEmpty()];
		}

		case "createAdministration": {
			return [
				body("nin", "nin is Invalid").notEmpty().trim(),
				body("semester", "semester is Invalid").notEmpty().trim(),
				body("nsn", "nsn is Invalid").notEmpty().trim(),
				body("study_program", "study_program is Invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("education", "education is Invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("education", "education is Invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("residence_address", "residence_address is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("nin_address", "nin_address is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("phone", "phone is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("birth_place", "birth_place is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("birth_date", "birth_date is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_name", "father_name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_occupation", "father_occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_income", "father_income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_name", "mother_name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_occupation", "mother_occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_income", "mother_income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("occupation", "occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("income", "income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("living_partner", "living_partner is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("financier", "financier is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
			];
		}

		case "createDocumentQuestion": {
			return [
				body("content", "content is invalid").notEmpty().trim(),
				body("description", "description is invalid").notEmpty().trim(),
			];
		}

		case "createCertificate": {
			return [
				body("user_id", "user_id is invalid").notEmpty().trim(),
				body("student_id", "student_id is invalid").notEmpty().trim(),
				body("subject_id", "subject_id is invalid").notEmpty().trim(),
				body("id_certificate", "id_certificate is invalid").notEmpty().trim(),
			];
		}

		case "createMeetingByAssessor": {
			return [
				body("time", "time is invalid in array").notEmpty().isArray(),
				body("topic", "topic is invalid").notEmpty().trim(),
				body("description", "description is invalid").notEmpty().trim(),
				body("place", "place is invalid").notEmpty().trim(),
			];
		}

		case "accMeetingByStudent": {
			return [
				param("id", "id params uuid is invalid").notEmpty().trim().isUUID(),
				body("time", "time is invalid").notEmpty(),
			];
		}

		case "getMeetingById": {
			return [
				param("id", "id params uuid is invalid").notEmpty().trim().isUUID(),
			];
		}
	}
};

exports.validatorMessage = (req, res, next) => {
	let errors = validationResult(req).array({ onlyFirstError: true });
	if (!errors.length) return next();

	errors = errors.map((error) => error.msg);
	errors = `${errors.join(", ")}.`;

	return res.status(400).json({ success: false, message: errors, data: {} });
};
