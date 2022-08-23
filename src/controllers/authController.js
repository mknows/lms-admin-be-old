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

      // const user = getClientAuth().currentUser;

      // await sendEmailVerification(user);

      return res.sendJson(201, true, "success create new user", {
        id: created.id,
        name: created.name,
        no_hp: created.no_hp,
        email: created.email,
      });
    } catch (err) {
      res.sendJson(500, false, err.message, null);
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

      const token = credential._tokenResponse.idToken;

      return res.sendJson(200, true, "success login", {
        email: credential.user.email,
        token,
      });
    } catch (err) {
      console.log(err);
      return res.sendJson(500, false, err.message, null);
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

      const emailFind = await getAdminAuth().getUserByEmail(email);

      const payload = {
        firebaseUID: emailFind.uid,
        email: emailFind.email,
      };

      const tokenResetPassword = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: "10m",
      });

      sendEmail(
        email,
        "forgot password",
        `
        <h2>forgot password</h2>
        <br>
        hello ${email}, you can update password after press this link below : <br>
        http://localhost:3000/api/v1/auth/reset-password/${tokenResetPassword}
      `
      );

      return res.sendJson(200, true, "success send", {});
    } catch (err) {
      return res.sendJson(500, false, err, null);
    }
  },

  /**
   * @desc      request verify email, send email link to user
   * @route     POST /api/v1/auth/req-verify-email
   * @access    Public
   */
  requestVerifyEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await getAdminAuth().getUserByEmail(email);

      if (!user) {
        return res.sendJson(404, false, "email ini tidak terdaftar", {});
      }

      const payload = {
        firebaseUID: user.uid,
        email: user.email,
      };

      const tokenVerifyEmail = jwt.sign(payload, JWT_SECRET_KEY);

      sendEmail(
        user.email,
        "verifikasi akun email",
        `
      <h3>verifikasi akun email anda</h3>
      <br>
      halo ${user.email},silahkan klik link dibawah ini untuk verifikasi akun email anda 
      <br>
      http://localhost:${PORT}/api/v1/auth/verify-email/${tokenVerifyEmail}
      `
      );

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

      console.log("token user verify email => ", token);

      const user = jwt.verify(token, JWT_SECRET_KEY);

      const updateVerify = await getAdminAuth().updateUser(user.firebaseUID, {
        emailVerified: true,
      });

      console.log("update verify => ", updateVerify);

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

      res.sendJson(200, true, "success get verify data", {
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
