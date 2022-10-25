const { StudentSubject, Certificate, User, Subject } = require("../models");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const pdfKit = require("pdfkit");
const fs = require("fs");
const blobStream = require("blob-stream");
const pdfDocument = new pdfKit({
	layout: "landscape",
	size: [2482, 3509],
	margin: 0,
});
const qr = require("qr-image");
const { Buffer } = require("buffer");
const randomString = require("randomstring");
require("dotenv").config({ path: "./controllerconfig.env" });
const { FINISHED } = process.env;

module.exports = {
	/**
	 * @desc      Create new certificate SUBJECT
	 * @route     POST /api/v1/certificate/subject
	 * @access    Private
	 */
	createCertificateSubject: asyncHandler(async (req, res) => {
		const { user_id, student_id, subject_id } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const checkDoneSubject = await StudentSubject.findOne({
			where: {
				student_id,
				subject_id,
			},
		});

		const user = await User.findOne({
			where: {
				id: user_id,
			},
		});

		const subject = await Subject.findOne({
			where: {
				id: subject_id,
			},
		});

		if (!subject) {
			return res.sendJson(404, false, "subject invalid");
		}

		if (!checkDoneSubject.status !== FINISHED) {
			return res.sendJson(404, false, "student has not finished his subject ");
		}

		const generateRandomCert = randomString.generate({
			capitalization: "uppercase",
			length: 12,
			charset: "alphanumeric",
		});

		const certificateLink =
			"www.kampusgratis.com/certificate/" + generateRandomCert;

		const outputQr = `${generateRandomCert}.png`;

		var qr_svg = qr.image(certificateLink, {
			type: "png",
			size: 6,
			margin: 1,
		});
		qr_svg.pipe(fs.createWriteStream(outputQr));

		const name = user.full_name;
		const subjectName = subject.name;
		const time = "12 Desember 2022";
		const predikat = "Sangat Baik";
		const nilai = 99;

		const outputPdf = `${generateRandomCert}-${name}-certificat.pdf`;
		pdfDocument.pipe(fs.createWriteStream(outputPdf));
		pdfDocument.image("public/cert/matkul.png", {
			fit: [3509, 2482],
			align: "center",
		});

		await sleep(2000);
		if (name.length <= 10) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1625, 930);
		} else if (name.length <= 15) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1470, 930);
		} else if (name.length <= 20) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1385, 930);
		} else if (name.length <= 25) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1300, 930);
		} else if (name.length <= 30) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1215, 930);
		} else if (name.length <= 35) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1125, 930);
		} else {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 825, 930);
		}
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#623B60")
			.fontSize(85)
			.text(subjectName.toUpperCase(), 1200, 1300);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Regular.ttf")
			.fillColor("black")
			.fontSize(60)
			.text(time, 1010, 1691);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Regular.ttf")
			.fillColor("#3C4048")
			.fontSize(40)
			.text(certificateLink, 2400, 2360);
		pdfDocument.image(outputQr, 3075, 2157);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(predikat, 1110, 1482);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(nilai, 1865, 1482);

		pdfDocument.end();

		const stream = pdfDocument.pipe(blobStream());
		stream.on("finish", async () => {
			await sleep(3000);
			// upload to firebase storage
			const file = fs.readFileSync(outputPdf);
			const nameFile = "documents/certificate/" + outputPdf;
			const buffer = Buffer.from(file, "utf-8");

			bucket
				.file(nameFile)
				.createWriteStream()
				.end(buffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, nameFile)).then((fileLink) => {
						Certificate.create({
							user_id,
							subject_id,
							student_id,
							file: nameFile,
							link: fileLink,
							id_certificate: generateRandomCert,
						});
					});

					return res.sendJson(
						201,
						true,
						"success upload new subject certificate"
					);
				});

			await sleep(2000);
			fs.unlinkSync(outputPdf);
			fs.unlinkSync(outputQr);
		});
	}),
	/**
	 * @desc      Create new certificate TRAINING
	 * @route     POST /api/v1/certificate/training
	 * @access    Private
	 */
	createCertificateTraining: asyncHandler(async (req, res) => {
		const { user_id, student_id, subject_id, id_certificate } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const user = await User.findOne({
			where: {
				id: user_id,
			},
		});

		const subject = await Subject.findOne({
			where: {
				id: subject_id,
			},
		});

		const generateRandomCert = randomString.generate({
			capitalization: "uppercase",
			length: 12,
			charset: "alphanumeric",
		});

		const certificateLink =
			"www.kampusgratis.com/certificate/" + generateRandomCert;

		const outputQr = `${generateRandomCert}.png`;

		var qr_svg = qr.image(certificateLink, {
			type: "png",
			size: 6,
			margin: 1,
		});
		qr_svg.pipe(fs.createWriteStream(outputQr));

		const name = user.full_name;
		const subjectName = subject.name;
		const time = "12 Desember 2022";
		const predikat = "SANGAT BAIK";
		const nilai = 99;

		const outputPdf = `${generateRandomCert}-${name}-certificat.pdf`;
		pdfDocument.pipe(fs.createWriteStream(outputPdf));
		pdfDocument.image("public/cert/pelatihan.png", {
			fit: [3509, 2482],
			align: "center",
		});

		await sleep(2000);
		if (name.length <= 10) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name, 1590, 875);
		} else if (name.length <= 17) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name, 1290, 875);
		} else if (name.length <= 25) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name, 1000, 875);
		} else {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name, 825, 875);
		}
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#623B60")
			.fontSize(85)
			.text(subjectName, 1200, 1200);
		pdfDocument
			.font("public/fonts/SegoeUIVF.ttf")
			.fillColor("black")
			.fontSize(60)
			.text(time, 1010, 1691);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Regular.ttf")
			.fillColor("#3C4048")
			.fontSize(40)
			.text(certificateLink, 2400, 2360);
		pdfDocument.image(outputQr, 3075, 2157);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(predikat, 1500, 1373);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(nilai, 2227, 1373);

		pdfDocument.end();
		return res.sendJson(201, true, "success upload new certificate");

		const stream = pdfDocument.pipe(blobStream());
		// stream.on("finish", async () => {
		// 	await sleep(2000);
		// 	// upload to firebase storage
		// 	const file = fs.readFileSync(outputPdf);
		// 	const nameFile = "documents/certificate/" + outputPdf;
		// 	const buffer = Buffer.from(file, "utf-8");

		// 	bucket
		// 		.file(nameFile)
		// 		.createWriteStream()
		// 		.end(buffer)
		// 		.on("finish", () => {
		// 			getDownloadURL(ref(storage, nameFile)).then((fileLink) => {
		// 				console.log("link in firebase => ", fileLink);
		// 			});

		// 			return res.sendJson(201, true, "success upload new certificate");
		// 		});

		// 	await sleep(2000);
		// 	fs.unlinkSync(outputPdf);
		// 	fs.unlinkSync(outputQr);
		// });
	}),

	/**
	 * @desc      Get certificate
	 * @route     GET /api/v1/certificate/:id_certificate
	 * @access    Public
	 */
	getCertificate: asyncHandler(async (req, res) => {
		const { id_certificate } = req.params;

		const search = await Certificate.findOne({
			where: {
				id_certificate,
			},
		});

		if (!search) {
			return res.sendJson(404, false, "certificate not found");
		}

		return res.sendJson(200, true, "success get certificate", search.link);
	}),
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
