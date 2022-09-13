const express = require("express");
const route = express.Router();

const profileController = require("../controllers/profileController");
const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection } = require("../middlewares/Authentication");

route.get("/me", protection, profileController.getMe);
route.put("/me", protection, validate("updateDataUser"), validatorMessage, profileController.updateMe);

module.exports = route;
