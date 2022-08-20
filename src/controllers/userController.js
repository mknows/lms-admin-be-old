const { User } = require("../models");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey_test-express-auth-firebase-adminsdk-vnzdj-17db49ab3a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  index: async (req, res) => {
    try {
      const data = await User.findAll();

      res.sendJson(200, true, "sucess get all data", data);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },

  create: async (req, res) => {
    try {
      const { name, email, password, no_hp } = req.body;

      const createAuthFirebase = await admin.auth().createUser({
        email,
        password,
        emailVerified: false,
        disabled: false,
      });

      const hashPassword = bcrypt.hashSync(password, 10);

      const created = await User.create({
        name,
        no_hp,
        email,
        password: hashPassword,
        firebaseUID: createAuthFirebase.uid,
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

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.sendJson(404, false, "email tidak ditemukan", null);
      }

      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        return res.sendJson(400, false, "password salah", null);
      }

      res.sendJson(200, true, "login success", user);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
};
