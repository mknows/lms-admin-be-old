require("dotenv").config({ path: "../config/.env" });
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey_test-express-auth-firebase-adminsdk-vnzdj-17db49ab3a.json");
const firebaseConfig = require("../config/webAccountKey.json");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../mails/mail");

const {
  getAuth: getClientAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} = require("firebase/auth");

const { getAuth: getAdminAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase/app");

initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { JWT_SECRET_KEY, PORT } = process.env;

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
      const { name, email, password, no_hp } = req.body;

      const credential = await createUserWithEmailAndPassword(
        getClientAuth(),
        email,
        password
      );

      const hashPassword = bcrypt.hashSync(password, 10);

      const created = await User.create({
        name,
        no_hp,
        email,
        password: hashPassword,
        firebaseUID: credential.user.uid,
        is_verified: false,
      });

      const user = getClientAuth().currentUser;

      await sendEmailVerification(user);

      return res.sendJson(
        201,
        true,
        "sukses buat akun baru, silahkan cek akun email masuk yang telah terdaftar di folder spam",
        {
          id: created.id,
          name: created.name,
          no_hp: created.no_hp,
          email: created.email,
        }
      );
    } catch (error) {
      let message,
        errorCode = error.code || 500;
      switch (errorCode) {
        case "auth/wrong-password": {
          message = "Invalid Combination Email and Password.";
          break;
        }
        case "auth/user-not-found": {
          message = "Invalid Combination Email and Password.";
          break;
        }
        case "auth/email-already-in-use": {
          message = "Email already used.";
          break;
        }
        default:
          message = "Something went wrong";
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

      const credential = await signInWithEmailAndPassword(
        getClientAuth(),
        email,
        password
      );

      const token = getClientAuth().currentUser.getIdToken();

      return res.sendJson(200, true, "success login", {
        email: credential.user.email,
        token,
      });
    } catch (error) {
      let message,
        errorCode = error.code || 500;
      switch (errorCode) {
        case "auth/wrong-password": {
          message = "Invalid Combination Email and Password.";
          break;
        }
        case "auth/user-not-found": {
          message = "Invalid Combination Email and Password.";
          break;
        }
        case "auth/email-already-in-use": {
          message = "Email already used.";
          break;
        }
        default:
          message = "Something went wrong";
      }

      return res.sendJson(403, false, message, {});
    }
  },

  /**
   * @desc      request forgot password user, send email link to user
   * @route     POST /api/v1/auth/reset-password
   * @access    Public
   */
  requestResetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      await sendPasswordResetEmail(getClientAuth(), email);

      return res.sendJson(200, true, "success send", {});
    } catch (err) {
      return res.sendJson(403, false, "something went wrong", {});
    }
  },

  /**
   * @desc      request verify email, send email link to user
   * @route     POST /api/v1/auth/verify-email
   * @access    Public
   */
  requestVerifyEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const result = await getAdminAuth().getUserByEmail(email);

      const user = getClientAuth().currentUser;
      console.log("user => ", user);

      await sendEmailVerification(result);

      return res.sendJson(200, true, "success send email verify");
    } catch (err) {
      return res.sendJson(500, false, err, null);
    }
  },

  /**
   * @desc      verify email
   * @route     GET /api/v1/auth/verify-email
   * @access    Public
   */
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const user = jwt.verify(token, JWT_SECRET_KEY);

      const updateVerify = await getAdminAuth().updateUser(user.firebaseUID, {
        emailVerified: true,
      });

      await User.update(
        {
          is_verified: true,
        },
        {
          where: {
            email: updateVerify.email,
          },
        }
      );

      res.sendJson(200, true, `success verify data ${user.email}`, {
        status: updateVerify.emailVerified,
      });
    } catch (err) {
      return res.sendJson(500, false, err, null);
    }
  },

  /**
   * @desc      verify id token
   * @route     GET /api/v1/auth/reset-password/:token
   * @access    Public
   */
  verifyResetPasswordToken: async (req, res) => {
    try {
      const token = req.params.token;

      const user = jwt.verify(token, JWT_SECRET_KEY);

      return res.sendJson(200, true, "token valid!", { token, user });
    } catch (err) {
      return res.sendJson(500, false, err, null);
    }
  },

  /**
   * @desc      process update password
   * @route     POST /api/v1/auth/reset-password/:token
   * @access    Public
   */
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = jwt.verify(token, JWT_SECRET_KEY);

      const currentUser = await getAdminAuth().updateUser(user.firebaseUID, {
        password,
      });

      const hashedPassword = bcrypt.hashSync(password, 10);

      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            email: currentUser.email,
          },
        }
      );

      return res.sendJson(200, true, "berhasil update password", {});
    } catch (err) {
      return res.sendJson(500, false, err, null);
    }
  },
};
