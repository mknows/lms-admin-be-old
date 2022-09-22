const express = require("express");
const route = express.Router();
const multer = require("multer");

const articleController = require("../controllers/articleController");

const upload = multer({
  storage: multer.memoryStorage(),
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
route.put("/update/:uuid", upload.single("image"), articleController.update);
route.delete("/delete/:id", articleController.delete)

module.exports = route;
