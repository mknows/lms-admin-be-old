const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const device = require("express-device");
const useragent = require("express-useragent");
const path = require("path");
const fs = require('fs')

dotenv.config({ path: "./src/config/config.env" });

const response = require("./src/helpers/responseFormatter");
const errResponseFirebase = require("./src/helpers/responseErrorFirebase");
const allRoutes = require("./src/routes/index");
const initializeFirebase = require("./src/config/firebaseConnection");
const errorHandler = require("./src/middlewares/Error");

const app = express();

initializeFirebase();

const pathDoc = "./public/documents"
const pathImg = "./public/images"
if(!fs.existsSync(pathDoc && pathImg)){
	fs.mkdirSync(pathDoc && pathImg, {recursive: true})
}

app.use("/file/documents", express.static(path.join(__dirname, "public/documents")));
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

const PORT = process.env.PORT || 8080;

app.use("/api/v1", allRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`[SERVER] NodeJS API Server running on port: ${PORT}`);
});

app.all("*", (req, res) => {
	return res
		.status(404)
		.json({ success: false, message: "Page not found.", data: {} });
});
