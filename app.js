require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const response = require("./src/helpers/responseFormatter");
const { PORT } = process.env;

app.use(response);
app.use(morgan("dev"));
app.use(bodyParser.json());
console.log("process.env => ", PORT);

app.get("/", (req, res) => {
  res.sendJson(200, true, "hello express", { token: "23456789sdfghj" });
});

app.get("/test", (req, res) => {
  res.sendDataCreated("success create test", { token: "2345678qwghj" });
});

app.listen(PORT, () => {
  console.log("server running on port :", PORT);
});
