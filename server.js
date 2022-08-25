const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./src/config/config.env" });

const response = require("./src/helpers/responseFormatter");
const allRoutes = require("./src/routes/index");
const initializeFirebase = require('./src/config/firebaseConnection');

require('./src/config/firebaseConnection');

const app = express();

initializeFirebase();

app.use(response);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, strict: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use("/api/v1", allRoutes);

app.listen(PORT, () => {
  console.log(`[SERVER] NodeJS API Server running on port: ${PORT}`);
});

app.all('*', (req, res) => {
  return res.status(404).json({ success: false, message: "Page not found.", data: {} });
});