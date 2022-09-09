const express = require("express");
const route = express.Router();

const mainControllerMyStudy = require("../../controllers/My-Study/MainController");
const majorControllerAdmin = require("../../controllers/My-Study/Admin/MajorController");
// const { validate, validatorMessage } = require("../middlewares/Validator");
// const { protection } = require("../middlewares/Authentication");

// route.post("/login", validate("loginUser"), validatorMessage, mainControllerMyStudy.insertStudy);
route.get("/", mainControllerMyStudy.getAllMajors);
route.post("/create", majorControllerAdmin.insertMajor);
route.put("/update/:majorId", majorControllerAdmin.editMajor);
route.delete("/delete/:majorId", majorControllerAdmin.removeMajor);
// route.put("/edit-major/:majorId", mainControllerMyStudy.editSubject);

module.exports = route;