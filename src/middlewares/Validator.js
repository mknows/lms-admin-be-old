const { body, validationResult } = require("express-validator");

exports.validate = (method) => {
<<<<<<< HEAD
	switch (method) {
		case "createUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
				body("password", "Password should be at least 5 characters")
					.not()
					.isEmpty()
					.isLength({ min: 5 }),
				body("full_name", "Full Name is invalid").notEmpty().trim(),
				body("gender", "Please insert your gender").notEmpty().trim(),
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
			];
		}
	}
};
=======
  switch (method) {
    case 'createUser': {
      return [
        body('email', 'Email address is invalid').notEmpty().trim().normalizeEmail().isEmail(),
        body('password', 'Password should be at least 5 characters').notEmpty().isLength({ min: 5 }),
        body('full_name', 'Full Name is invalid').notEmpty().trim().isAlpha('en-US', { ignore: ' ' }),
        body('gender', 'Gender is invalid').notEmpty().trim().isIn([0, 1, 2, 9])
      ];
    }
    case 'loginUser': {
      return [
        body('email', 'Email address is invaloid').notEmpty().trim().normalizeEmail().isEmail(),
        body('password', 'Password is required').notEmpty().trim()
      ];
    }
    case 'forgetPasswordUser': {
      return [
        body('email', 'Email address is invalid').notEmpty().trim().normalizeEmail().isEmail()
      ];
    }

    case 'updateDataUser': {
      return [
        body('full_name', 'Full Name is invalid').notEmpty().trim().isAlpha('en-US', { ignore: ' ' }),
        body('gender', 'Gender is invalid').notEmpty().trim().isIn([0, 1, 2, 9])
      ]
    }
  }
}
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

exports.validatorMessage = (req, res, next) => {
	let errors = validationResult(req).array({ onlyFirstError: true });
	if (!errors.length) return next();

	errors = errors.map((error) => error.msg);
	errors = `${errors.join(", ")}.`;

	return res.status(422).json({ success: false, message: errors, data: {} });
};
