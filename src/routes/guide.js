const express = require("express");
const route = express.Router();

const guideController = require("../controllers/guideController");

route.get("/getbytype", guideController.getAllGuideByType);
route.get("/getbyid/:id", guideController.getGuideByID);
route.get("/glossary", guideController.getAllGlossaries);
route.get("/glossary/:id", guideController.getGlossaryByID);

module.exports = route;
