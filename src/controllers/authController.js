const { User } = require("../models");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey_test-express-auth-firebase-adminsdk-vnzdj-17db49ab3a.json");
const firebaseConfig = require("../config/webAccountKey.json");

const {
  getAuth: getClientAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");

const { getAuth: getAdminAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase/app");

initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

      res.sendJson(201, true, "success create new user", {
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
        credential,
      });
    } catch (err) {
      console.log(err);
      return res.sendJson(500, false, err.message, null);
    }
  },
};
