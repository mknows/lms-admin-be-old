const express = require("express");
const route = express.Router();

const shortcutsController = require("../controllers/shortcutsController");

route.post("/makesubjectquick", shortcutsController.createSubjectComplete);

route.delete("/nukeusers", shortcutsController.deleteAllFirebaseUser);

route.post("/makestudent", shortcutsController.makeUserToStudent);

route.post("/makemajor", shortcutsController.makeMajor);

module.exports = route;
