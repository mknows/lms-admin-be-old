const jwt = require("jsonwebtoken");
const requestPromise = require("request-promise");

const API_KEY = "Z2Z1FPjPTAWLa7lVEj3ksg";
const API_SECRET = "XqanlZ3ocoKGlblaokKRen38u0YEhGTNT4mI";

const payload = {
	iss: API_KEY,
	exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, API_SECRET);

email = "mknowsconsulting1@gmail.com";
const options = {
	method: "POST",
	uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
	body: {
		topic: "Class Consultation",
		type: 1,
		settings: {
			host_video: false,
			participant_video: true,
			join_before_host: false,
			mute_upon_entry: true,
			watermark: false,
			use_pmi: false,
			approval_type: 0,
			audio: "both",
			auto_recording: "none",
			enforce_login: false,
			registrants_email_notification: true,
		},
	},
	auth: {
		bearer: token,
	},
	headers: {
		"User-Agent": "Zoom-api-Jwt-Request",
		"content-type": "application/json",
	},
	json: true, //Parse the JSON string in the response
};

requestPromise(options)
	.then(function (response) {
		// console.log(JSON.stringify(response));
		console.log(response);
		console.log(response.join_url);
		console.log(response.password);
	})
	.catch((err) => {
		console.log(err);
	});
