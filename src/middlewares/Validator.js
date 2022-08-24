const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('email', 'Email address is invalid').notEmpty().trim().normalizeEmail().isEmail(),
        body('password', 'Password should be at least 5 characters').not().isEmpty().isLength({ min: 5 }),
        body('fullName', 'Full Name is invalid').notEmpty().trim().isAlpha('en-US', { ignore: ' ' })
      ];
    }
    case 'loginUser': {
      return [
        body('email', 'Email address is invalid').notEmpty().trim().normalizeEmail().isEmail(),
        body('password', 'Password is required').notEmpty().trim()
      ];
    }
    case 'forgetPasswordUser': {
      return [
        body('email', 'Email address is invalid').notEmpty().trim().normalizeEmail().isEmail()
      ];
    }
  }
}

exports.validatorMessage = (req, res, next) => {
  let errors = validationResult(req).array({ onlyFirstError: true });
  if (!errors.length) return next();

  errors = errors.map(error => error.msg);
  errors = `${errors.join(", ")}.`;

  return res.status(422).json({ success: false, message: errors, data: {} });
}