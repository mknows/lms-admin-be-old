const express = require("express");
const route = express.Router();

const eventController = require("../controllers/eventController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/all", eventController.getAllEvents);
route.get("/event/:id", eventController.getEvent);
route.get(
	"/student",
	protection,
	authorize("student"),
	eventController.getStudentsEvent
);
route.post(
	"/join/:event_id",
	protection,
	authorize("student"),
	eventController.joinEvent
);

module.exports = route;
