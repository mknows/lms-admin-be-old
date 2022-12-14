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
const moment = require("moment");
// const csrf = require("csurf");
const csrfMiddleware = require("./src/middlewares/csrf");

dotenv.config();

const response = require("./src/helpers/responseFormatter");
const errResponseFirebase = require("./src/helpers/responseErrorFirebase");
const allRoutes = require("./src/routes/index");
const initializeFirebase = require("./src/config/firebaseConnection");
const errorHandler = require("./src/middlewares/Error");
const fs = require("fs");
require("./src/helpers/redis");
require("./src/helpers/loggingGcp");

const app = express();

// const accessLogStream = fs.createWriteStream(
// 	path.join(__dirname, "logger.log"),
// 	{ flags: "a" }
// );

initializeFirebase();

app.disable("x-powered-by");

app.use("/file/images", express.static(path.join(__dirname, "public/images")));
app.use(device.capture());
app.use(useragent.express());
app.set("trust proxy", true);
app.use(response);
app.use(errResponseFirebase);
morgan.token("date", (req, res, tz) => {
	return moment().tz(tz).format("YYYY-MM-DD HH:mm:ss");
});
morgan.format(
	"combined",
	':remote-addr - :remote-user [:date[Asia/Jakarta]] ":method :url HTTP/:http-version" STATUS::status :response-time ms ":referrer" ":user-agent"'
);
app.use(morgan("dev"));
// app.use(morgan("combined", { stream: accessLogStream }));
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
