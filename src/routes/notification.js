const express = require("express");
const route = express.Router();
const { protection, authorize } = require("../middlewares/Authentication");
const routeController = require("../controllers/notificationController");

route.post("/postNotificationGlobal", protection, routeController.postNotificationGlobal);
route.put("/readNotification", protection, routeController.readNotification);

module.exports = route;
