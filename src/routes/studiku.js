const express = require("express");
const route = express.Router();

const matakuliahController = require("../controllers/matakuliahController");

route.get("/all", matakuliahController.getAllMatakuliah);

module.exports = route;
