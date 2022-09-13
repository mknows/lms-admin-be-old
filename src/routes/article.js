const express = require("express");
const route = express.Router();
const multer = require("multer");

const articleController = require("../controllers/articleController");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.split(" ").join("-"));
  },
});

const upload = multer({
  storage: diskStorage,
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
        new Error(
          "oops! this file just support  .png, .jpg or .jpeg format allowed"
        )
      );
    }
  },
});

route.get("/index", articleController.index);
route.post("/create", upload.single("image"), articleController.create);

module.exports = route;
