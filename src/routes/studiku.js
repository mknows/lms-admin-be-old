const express = require("express");
const route = express.Router();

const matakuliahController = require("../controllers/matakuliahController");
const profileController = require("../controllers/profileController");
const { validate, validatorMessage } = require('../middlewares/Validator');
const { protection } = require("../middlewares/Authentication");

route.get("/all", matakuliahController.getAllMatakuliah);
route.get("/matakuliahMurid", protection, matakuliahController.getMatakuliahMurid);
route.put("/matakuliahMurid", protection, validate('updateDataUser'), validatorMessage, profileController.updateMe);

module.exports = route;
