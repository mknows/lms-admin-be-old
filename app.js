require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const response = require("./src/helpers/responseFormatter");
const { PORT } = process.env;
const routeAPI = require("./src/routes/index");

app.use(response);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api/v1", routeAPI);

app.listen(PORT, () => {
  console.log("server running on port :", PORT);
});
