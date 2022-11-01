const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const device = require("express-device");
const useragent = require("express-useragent");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
// const csrf = require("csurf");
const csrfMiddleware = require("./src/middlewares/csrf");
const winston = require("winston");
const expressWinston = require("express-winston");

dotenv.config({ path: "./src/config/config.env" });

const response = require("./src/helpers/responseFormatter");
const errResponseFirebase = require("./src/helpers/responseErrorFirebase");
const allRoutes = require("./src/routes/index");
const initializeFirebase = require("./src/config/firebaseConnection");
const errorHandler = require("./src/middlewares/Error");
require("./src/helpers/redis");

const app = express();

initializeFirebase();

app.disable("x-powered-by");

app.use("/file/images", express.static(path.join(__dirname, "public/images")));
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
app.use(helmet());
app.use(helmet.hidePoweredBy());
// * ntar belakangan menggunakan CSRF ini
// app.use(
// 	csrf({
// 		cookie: {
// 			// key: "kampusgratis",
// 			// httpOnly: true,
// 			maxAge: 600,
// 			// secure: true,
// 			// domain: "google.com",
// 		},
// 	})
// );
// app.use(csrfMiddleware);

const PORT = process.env.PORT || 8080;

app.use(
	"/api/v1",
	// csrfMiddleware,
	allRoutes
);

// app.get("/", (req, res) => {
// 	res.cookie("csrf-token", req.csrfToken());

// 	res.send(req.csrfToken());
// });

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`[SERVER] NodeJS API Server running on port: ${PORT}`);
});

app.all("*", (req, res) => {
	return res
		.status(404)
		.json({ success: false, message: "Page not found.", data: {} });
});
