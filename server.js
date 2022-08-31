const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors")

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
app.use(cors())

const PORT = process.env.PORT || 8080;

app.use("/api/v1", allRoutes);

app.listen(PORT, {
  cors: {
    origin: "*"
  } 
});

app.all('*', (req, res) => {
  return res.status(404).json({ success: false, message: "Page not found.", data: {} });
});