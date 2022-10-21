const bodyParser = require("body-parser");
const parseForm = bodyParser.urlencoded({ extended: false });

module.exports = function (req, res, next) {
	console.log("varMiddleware token : ", req.csrfToken());
	res.cookie("csrf-token", req.csrfToken());
	next();
};

exports.parseForm = parseForm;
