const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
<<<<<<< HEAD
const cors = require("cors");
const device = require("express-device");
const useragent = require("express-useragent");
=======
const device = require("express-device");
const useragent = require("express-useragent");
const path = require("path");
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

dotenv.config({ path: "./src/config/config.env" });

const errResponseFirebase = require("./src/helpers/responseErrorFirebase");
const checkExistence = require("./src/helpers/checkExistence");
const response = require("./src/helpers/responseFormatter");
const errResponseFirebase = require("./src/helpers/responseErrorFirebase");
const allRoutes = require("./src/routes/index");
const initializeFirebase = require("./src/config/firebaseConnection");
<<<<<<< HEAD

require("./src/config/firebaseConnection");
=======
const errorHandler = require("./src/middlewares/Error");
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

const app = express();

initializeFirebase();

<<<<<<< HEAD
app.use("/file", express.static("/public"));
=======
app.use("/file", express.static(path.join(__dirname, "public/documents")));
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
app.use(device.capture());
app.use(useragent.express());
app.set("trust proxy", true);
app.use(response);
app.use(errResponseFirebase);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, strict: false }));
app.use(cookieParser());
app.use(cors());
app.use(errResponseFirebase);
app.use(checkExistence);

const PORT = process.env.PORT || 8080;

app.use("/api/v1", allRoutes);

<<<<<<< HEAD
app.listen(
	PORT,
	{
		cors: {
			origin: "*",
		},
	},
	console.log(`Running in port ${PORT}`)
);

app.all("*", (req, res) => {
	return res
		.status(404)
		.json({ success: false, message: "Page not found.", data: {} });
});
=======
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] NodeJS API Server running on port: ${PORT}`);
});

app.all("*", (req, res) => {
  return res.status(404).json({ success: false, message: "Page not found.", data: {} });
});
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
