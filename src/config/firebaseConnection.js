const firebaseConnection = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { cert } = require("firebase-admin/app");

const dbCredential = require("./firebaseAdminKampusGratis.json");
const webCredential = require("./firebaseWebKampusGratis.json");

const initializeFirebase = async () => {
	firebaseConnection.initializeApp({
		credential: cert(dbCredential),
		databaseURL:
			"https://kampus-gratis2-default-rtdb.asia-southeast1.firebasedatabase.app",
			storageBucket: "gs://kampus-gratis2.appspot.com"
	});

	initializeApp(webCredential);
};

module.exports = initializeFirebase;
