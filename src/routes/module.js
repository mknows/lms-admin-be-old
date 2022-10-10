const express = require("express");
const route = express.Router();
const moduleController = require("../controllers/moduleController");
const { protection, authorize } = require("../middlewares/Authentication");

route.post("/create", protection, moduleController.createModule);
route.post("/createvideo", protection, moduleController.createVideo);
route.post("/createdocument", protection, moduleController.createDocument);

route.get("/", protection, moduleController.getAllModule);
route.get("/video", protection, moduleController.getAllVideo);
route.get("/document", protection, moduleController.getAllDocument);

route.get(
	"/session/:session_id",
	protection,
	authorize("student"),
	moduleController.getModuleInSession
);
route.post(
	"/enroll/:module_id",
	protection,
	authorize("student"),
	moduleController.takeModule
);

route.get("/:id", protection, moduleController.getModule);
route.get("/video/:id", protection, moduleController.getVideo);
route.get("/document/:id", protection, moduleController.getDocument);

route.put("/edit/:module_id", protection, moduleController.editModule);
route.put("/video/edit/:video_id", protection, moduleController.editVideo);
route.put(
	"/document/edit/:document_id",
	protection,
	moduleController.editDocument
);

route.delete("/delete/:module_id", protection, moduleController.deleteModule);
route.delete(
	"/video/delete/:video_id",
	protection,
	moduleController.deleteVideo
);
route.delete(
	"/document/delete/:document_id",
	protection,
	moduleController.deleteDocument
);

module.exports = route;
