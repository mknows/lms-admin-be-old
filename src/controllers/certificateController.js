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
	size: [2481, 3508],
	margin: 0,
});
const qr = require("qr-image");
const { Buffer } = require("buffer");
const randomString = require("randomstring");

module.exports = {
	/**
	 * @desc      Create new certificate by admin
	 * @route     POST /api/v1/certificate/create
	 * @access    Private
	 */
	createCertificate: asyncHandler(async (req, res) => {
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
		console.log("certificateLink => ", certificateLink);

		const outputQr = `${generateRandomCert}.png`;

		var qr_svg = qr.image(certificateLink, {
			type: "png",
			size: 8,
			margin: 1,
		});
		qr_svg.pipe(fs.createWriteStream(outputQr));

		const name = user.full_name;
		const subjectName = subject.name;
		const time = "12 Desember 2022";

		const outputPdf = `${generateRandomCert}-${name}-certificat.pdf`;
		pdfDocument.pipe(fs.createWriteStream(outputPdf));
		pdfDocument.image("public/images/cert.png", {
			fit: [3508, 2481],
			align: "center",
		});

		await sleep(2000);
		pdfDocument
			.font("public/fonts/Poppins-Medium.otf")
			.fillColor("black")
			.fontSize(100)
			.text(name, 1250, 1000);
		pdfDocument
			.font("public/fonts/Poppins-LightItalic.otf")
			.fillColor("black")
			.fontSize(85)
			.text(subjectName, 1200, 1375);
		pdfDocument
			.font("public/fonts/Poppins-Medium.otf")
			.fillColor("black")
			.fontSize(70)
			.text(time, 1610, 1624);
		pdfDocument
			.font("public/fonts/Poppins-Medium.otf")
			.fillColor("#3C4048")
			.fontSize(40)
			.text(certificateLink, 2375, 2360);
		pdfDocument.image(outputQr, 65, 2130);

		pdfDocument.end();

		const stream = pdfDocument.pipe(blobStream());
		stream.on("finish", async () => {
			await sleep(2000);
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
						console.log("link in firebase => ", fileLink);
					});

					return res.sendJson(201, true, "success upload new certificate");
				});

			await sleep(2000);
			fs.unlinkSync(outputPdf);
			fs.unlinkSync(outputQr);
		});
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
