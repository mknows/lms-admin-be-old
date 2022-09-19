const express = require("express");
const route = express.Router();

const majorController = require("../controllers/majorController");
const { protection } = require("../middlewares/Authentication");

route.get("/", protection, majorController.getAllMajors);
route.get("/:majorId", protection, majorController.getMajor);

route.post("/create", protection, majorController.postMajor);
route.put("/edit/:majorId", protection, majorController.editMajor);
route.delete("/delete/:majorId", protection, majorController.removeMajor);

module.exports = route;
