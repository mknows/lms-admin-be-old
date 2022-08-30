const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  getAuth: getClientAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  updateProfile,
  sendVerificationEmail
} = require("firebase/auth");

const { getAuth: getAdminAuth } = require("firebase-admin/auth");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  /**
   * @desc      Get All Data User
   * @route     GET /api/v1/auth/user
   * @access    Public
   */
  getAllDataUser: async (req, res) => {
    try {
      const data = await User.findAll();

      res.sendJson(200, true, "sucess get all data", data);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },

  /**
   * @desc      Register Account
   * @route     POST /api/v1/auth/register
   * @access    Public
   */
  createUser: async (req, res) => {
    try {
      const { fullName, email, password, phone, gender } = req.body;
      const credential = await createUserWithEmailAndPassword(
        getClientAuth(),
        email,
        password
      );
      await updateProfile(credential.user, {
        displayName: titleCase(fullName).trim(),
        emailVerified: false
      });

      const hashPassword = bcrypt.hashSync(password, 10);
    
      const created = await User.create({
        firebaseUID: credential.user.uid,
        fullName,
        email,
        password: hashPassword,
        phone,
        isLecturer: false,
        isVerified: false,
        gender,
      });

      const user = getClientAuth().currentUser;

      await sendEmailVerification(user);

      return res.sendJson(
        201,
        true,
        "Register success. Please verify your email by click link at your mail inbox.",
        {
          id: created.id,
          fullName: created.name,
          email: created.email,
        }
      );
    } catch (error) {
      console.log(error);
      let message, errorCode = error.code || 500;
      switch (errorCode) {
        case "auth/wrong-password": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/user-not-found": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/email-already-in-use": {
          message = "This email already used by another account.";
          break;
        }
        default:
          message = "Something went wrong.";
      }

      return res.sendJson(403, false, message, {});
    }
  },

  /**
   * @desc      Login Account Using Email and Password
   * @route     POST /api/v1/auth/login
   * @access    Public
   */
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const auth = getClientAuth();
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await auth.currentUser.getIdToken();

      return res.sendJson(200, true, `Login success. Hi ${credential.user.displayName}!`, {
        token : `Bearer ${token}`,
      }, {
        name: "token", value: token
      });
    } catch (error) {
      console.error(error);
      let message, errorCode = error.code || 500;
      switch (errorCode) {
        case "auth/wrong-password": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/user-not-found": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/email-already-in-use": {
          message = "This email already used by another account.";
          break;
        }
        default:
          message = "Something went wrong.";
      }

      return res.sendJson(403, false, message, {});
    }
  },

  /**
   * @desc      request forgot password user, send email link to user
   * @route     POST /api/v1/auth/forget-password
   * @access    Public
   */
  requestResetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      await sendPasswordResetEmail(getClientAuth(), email);

      return res.sendJson(200, true, "Reset Password email has been send. Please check your mail inbox to reset your password.", {});
    } catch (err) {
      console.error(err);
      return res.sendJson(403, false, "Something went wrong.", {});
    }
  },

  /**
   * @desc      request verify email, send email link to user
   * @route     POST /api/v1/auth/verify-email
   * @access    Public
   */
  requestVerificationEmail: async (req, res) => {
    try {
      let token = req.firebaseToken;

      if (!token) return res.status(409).json({
        success: false,
        message: "Invalid authorization.",
        data: {}
      });

      const user = getClientAuth().currentUser;

      if (!user) return res.status(409).json({
        success: false,
        message: "Invalid authorization.",
        data: {}
      });

      if (user.emailVerified) return res.status(400).json({
        success: false,
        message: "This email already verified.",
        data: {}
      });

      await sendEmailVerification(user);

      return res.sendJson(200, true, "Email verification sent. Please check your email inbox.", {});
    } catch (err) {
      console.log(err);
      return res.sendJson(500, false, err, null);
    }
  }
};

// Usage for Capitalize Each Word
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

// Usage for Phone Number Validator (Firebase) (Example: +62 822 xxxx xxxx)
function phoneNumber(number) {
  var validationPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  if (number.value.match(validationPhone)) {
    return true;
  }
  else {
    alert("message");
    return false;
  }
}