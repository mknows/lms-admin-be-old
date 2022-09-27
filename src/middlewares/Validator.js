const { body, validationResult } = require("express-validator");

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
				body("administration_id", "invalid administration_id")
					.notEmpty()
					.trim(),
				body("full_name", "invalid administration_id")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("email", "invalid email").notEmpty().isEmail().trim(),
				body("nin", "invalid nin").notEmpty().trim(),
				body("study_program", "invalid study_program").notEmpty(),
				body("semester", "invalid semester").notEmpty().trim(),
				body("nin_address", "invalid nin_address").notEmpty(),
				body("residence_address", "invalid residence_address").notEmpty(),
				body("birth_place", "invalid birth_place").notEmpty(),
				body("birth_date", "invalid birth_date").notEmpty(),
				body("phone", "invalid phone").notEmpty().trim(),
				body("gender", "invalid gender").notEmpty().trim().isIn([0, 1, 2, 9]),
				body("nsn", "invalid nsn").notEmpty().trim(),
				body("university_of_origin", "invalid university_of_origin").notEmpty(),
			];
		}

		case "administrationFamilial": {
			return [
				body("administration_id", "invalid administration_id")
					.notEmpty()
					.trim(),

				body("father_name", "invalid father_name").notEmpty(),
				body("father_occupation", "invalid father_occupation").notEmpty(),
				body("father_income", "invalid father_income").notEmpty().trim(),

				body("mother_name", "invalid mother_name").notEmpty(),
				body("mother_occupation", "invalid mother_occupation").notEmpty(),
				body("mother_income", "invalid mother_income").notEmpty().trim(),

				body("occupation", "invalid occupation").notEmpty(),
				body("income", "invalid income").notEmpty().trim(),
				body("living_partner", "invalid living_partner").notEmpty(),
				body("financier", "invalid financier").notEmpty(),
			];
		}

		case "administrationDegree": {
			return [
				body("administration_id", "invalid administration_id")
					.notEmpty()
					.trim(),
				body("degree", "invalid degree").notEmpty(),
			];
		}

		case "createAdministration": {
			return [
				body("nin", "nin is invalid").notEmpty().trim(),
				body("semester", "semester is invalid").notEmpty().trim(),
				body("nsn", "nsn is invalid").notEmpty().trim(),
				body("study_program", "study_program is invalid")
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
	}
};

exports.validatorMessage = (req, res, next) => {
	let errors = validationResult(req).array({ onlyFirstError: true });
	if (!errors.length) return next();

	errors = errors.map((error) => error.msg);
	errors = `${errors.join(", ")}.`;

	return res.status(422).json({ success: false, message: errors, data: {} });
};
