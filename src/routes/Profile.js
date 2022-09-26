const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: "2mb",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      return cb(null, true);
    } else {
      cb(null, true);
      return cb(
        new ErrorResponse(
          "Sorry, this upload only support file with type .png, .jpg or .jpeg.",
          400
        )
      );
    }
  },
});

const profileController = require("../controllers/profileController");
const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/me", protection, authorize("user"), profileController.getMe);
route.put(
<<<<<<< HEAD
	"/me",
	protection,
	upload.single("display_picture"),
	authorize("user"),
	validate("updateDataUser"),
	validatorMessage,
	profileController.updateMe
=======
  "/me",
  protection,
  upload.single("image"),
  authorize("user"),
  validate("updateDataUser"),
  validatorMessage,
  profileController.updateMe
>>>>>>> 3cdb032 (fix firebase storage)
);

module.exports = route;
