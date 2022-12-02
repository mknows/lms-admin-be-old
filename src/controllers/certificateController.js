const { Student, Certificate, User, Subject } = require("../models");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const moment = require("moment");
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
const pagination = require("../helpers/pagination");
const { Op } = require("sequelize");
const { fromPath } = require("pdf2pic");
require("dotenv").config();
const {
	FLOOR_A,
	FLOOR_A_MINUS,
	FLOOR_B_PLUS,
	FLOOR_B,
	FLOOR_B_MINUS,
	FLOOR_C_PLUS,
	FLOOR_C,
	FLOOR_D,
	FLOOR_E,
} = process.env;

module.exports = {
	/**
	 * @desc      Create new certificate SUBJECT
	 * @route     POST /api/v1/certificate/subject
	 * @access    Private
	 **/
	createCertificateSubject: asyncHandler(async (data) => {
		const storage = getStorage();
		const bucket = admin.storage().bucket();
		const { student_id, subject_id, final_subject_score } = data;
		const student = await Student.findOne({
			attributes: {
				include: ["id"],
			},
			where: {
				id: student_id,
			},
			include: [
				{
					model: Subject,
					attributes: {
						include: ["id", "name"],
					},
				},
				{
					model: User,
					attributes: {
						include: ["full_name", "id"],
					},
				},
			],
		});
		if (!student) {
			return res.sendJson(400, false, "Student not found");
		}
		if (!student.Subjects) {
			return res.sendJson(400, false, "Subject not found");
		}
		if (student.Subjects[0].StudentSubject.status !== "FINISHED") {
			return res.sendJson(400, false, "Subject not finished");
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

		const name = student.User.full_name;
		const subjectName = student.Subjects[0].name;
		const time = moment().format("DD/MM/YYYY");
		const score = final_subject_score.toFixed(2);
		const predicate = letterByPercent(score);
		const outputPdf = `${generateRandomCert}-${name}-certificate.pdf`;
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
				.text(name.toUpperCase(), 1370, 930);
		} else if (name.length <= 25) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1100, 930);
		} else if (name.length <= 30) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1000, 930);
		} else if (name.length <= 35) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 900, 930);
		} else {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 820, 930);
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
			.text(predicate, 1110, 1482);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(score, 1865, 1482);

		pdfDocument.end();

		const createdPdf = await Certificate.create({
			user_id: student.User.id,
			subject_id,
			student_id,
			id_certificate: generateRandomCert,
			student_id,
		});

		const stream = pdfDocument.pipe(blobStream());
		stream.on("finish", async () => {
			await sleep(3000);
			// upload to firebase storage
			const filePdf = fs.readFileSync(outputPdf);
			const nameFilePath = "documents/certificate/" + outputPdf;
			const bufferPdf = Buffer.from(filePdf, "utf-8");

			bucket
				.file(nameFilePath)
				.createWriteStream()
				.end(bufferPdf)
				.on("finish", () => {
					getDownloadURL(ref(storage, nameFilePath)).then(async (fileLink) => {
						await Certificate.update(
							{
								file: nameFilePath,
								link: fileLink,
							},
							{
								where: {
									id: createdPdf.id,
								},
							}
						);
					});
				});

			await sleep(1000);
			// create an image for thumbnail file pdf
			const storeAsImage = fromPath(outputPdf, {
				density: 100,
				saveFilename: `${generateRandomCert}-${name}`,
				savePath: "./",
				format: "png",
				width: 3509,
				height: 2482,
			});

			const fileThumbnail = `${generateRandomCert}-${name}.1.png`;
			storeAsImage(1).then((res) => {
				console.log("success convert pdf to png");
				return res;
			});

			await sleep(5000);
			fs.readFile(fileThumbnail, async (err, data) => {
				if (err) console.log(err);
				// convert image file to base64-encoded string
				const base64Image = Buffer.from(data, "binary");
				const nameFilePathThumbnail = "documents/certificate/" + fileThumbnail;

				bucket
					.file(nameFilePathThumbnail)
					.createWriteStream()
					.end(base64Image)
					.on("finish", () => {
						getDownloadURL(ref(storage, nameFilePathThumbnail)).then(
							async (fileLink) => {
								await Certificate.update(
									{
										thumbnail: nameFilePathThumbnail,
										thumbnail_link: fileLink,
									},
									{
										where: {
											id: createdPdf.id,
										},
									}
								);
							}
						);
					});
				await sleep(1000);
				fs.unlinkSync(outputPdf);
				fs.unlinkSync(outputQr);
				fs.unlinkSync(fileThumbnail);

				return res.sendJson(
					201,
					true,
					"success upload new subject certificate"
				);
			});
		});
	}),
	/**
	 * @desc      Create new certificate SUBJECT
	 * @route     POST /api/v1/certificate/subject
	 * @access    Private
	 */
	createCertificateSubjectManual: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const storage = getStorage();
		const bucket = admin.storage().bucket();
		const { subject_id, final_subject_score } = req.body;
		const student = await Student.findOne({
			attributes: ["id"],
			where: {
				id: student_id,
			},
			include: [
				{
					model: Subject,
					where: {
						id: subject_id,
					},
					attributes: ["name", "id"],
					through: {
						attributes: ["status"],
					},
				},
				{
					model: User,
					attributes: ["full_name", "id"],
				},
			],
		});
		const findUserId = await Student.findOne({
			where: {
				id: student_id,
			},
		});

		const user_id = findUserId.user_id;
		if (!student) {
			return res.sendJson(400, false, "User or subject not invalid");
		}

		if (!student.Subjects) {
			return res.sendJson(404, false, "Subject not found");
		}

		if (student.Subjects[0].StudentSubject.status !== "FINISHED") {
			return res.sendJson(400, false, "Student has not finished the subject", {
				status: student.Subjects[0].StudentSubject.status,
			});
		}

		const checkAvailable = await Certificate.findOne({
			where: {
				subject_id,
				student_id,
			},
		});

		if (checkAvailable) {
			return res.sendJson(200, true, "certificate already exist", {
				user_id: checkAvailable.user_id,
				student_id: checkAvailable.student_id,
				subject_id: checkAvailable.subject_id,
				id_certificate: checkAvailable.id_certificate,
				link: checkAvailable.link,
			});
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

		const name = student.User.full_name;
		const subjectName = student.Subjects[0].name;
		const time = moment().format("DD/MM/YYYY");
		const score = final_subject_score.toFixed(2);
		const predicate = letterByPercent(score);
		const outputPdf = `${generateRandomCert}-${name}-certificate.pdf`;
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
				.text(name.toUpperCase(), 1370, 930);
		} else if (name.length <= 25) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1100, 930);
		} else if (name.length <= 30) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 1000, 930);
		} else if (name.length <= 35) {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 900, 930);
		} else {
			pdfDocument
				.font("public/fonts/Monotype-Corsiva.ttf")
				.fillColor("#623B60")
				.fontSize(145)
				.text(name.toUpperCase(), 820, 930);
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
			.text(predicate, 1110, 1482);
		pdfDocument
			.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
			.fillColor("#FBB416")
			.fontSize(60)
			.text(score, 1865, 1482);

		pdfDocument.end();

		const createdPdf = await Certificate.create({
			user_id,
			subject_id,
			student_id,
			id_certificate: generateRandomCert,
			student_id,
		});

		const stream = pdfDocument.pipe(blobStream());
		stream.on("finish", async () => {
			await sleep(3000);
			// upload to firebase storage
			const filePdf = fs.readFileSync(outputPdf);
			const nameFilePath = "documents/certificate/" + outputPdf;
			const bufferPdf = Buffer.from(filePdf, "utf-8");

			bucket
				.file(nameFilePath)
				.createWriteStream()
				.end(bufferPdf)
				.on("finish", () => {
					getDownloadURL(ref(storage, nameFilePath)).then(async (fileLink) => {
						await Certificate.update(
							{
								file: nameFilePath,
								link: fileLink,
							},
							{
								where: {
									id: createdPdf.id,
								},
							}
						);

						await sleep(4000);
						fs.unlinkSync(outputPdf);
						fs.unlinkSync(outputQr);

						return await res.sendJson(
							201,
							true,
							"success upload new subject certificate",
							{
								user_id: createdPdf.user_id,
								student_id: createdPdf.student_id,
								subject_id: createdPdf.subject_id,
								id_certificate: createdPdf.id_certificate,
								link: fileLink,
							}
						);
					});
				});

			// *convert pdf to image png for thumbnail cert
			// await sleep(1000);
			// const storeAsImage = fromPath(outputPdf, {
			// 	density: 100,
			// 	saveFilename: `${generateRandomCert}-${name}`,
			// 	savePath: "./",
			// 	format: "png",
			// 	width: 3509,
			// 	height: 2482,
			// });

			// const fileThumbnail = `${generateRandomCert}-${name}.1.png`;
			// storeAsImage(1).then((res) => {
			// 	console.log("success convert pdf to png");
			// 	return res;
			// });

			// await sleep(5000);
			// fs.readFile(fileThumbnail, async (err, data) => {
			// 	if (err) console.log("error read file pdf2pic", err);
			// 	// convert image file to base64-encoded string
			// 	const base64Image = Buffer.from(data, "binary");
			// 	const nameFilePathThumbnail = "documents/certificate/" + fileThumbnail;

			// 	bucket
			// 		.file(nameFilePathThumbnail)
			// 		.createWriteStream()
			// 		.end(base64Image)
			// 		.on("finish", () => {
			// 			getDownloadURL(ref(storage, nameFilePathThumbnail)).then(
			// 				async (fileLink) => {
			// 					await Certificate.update(
			// 						{
			// 							thumbnail: nameFilePathThumbnail,
			// 							thumbnail_link: fileLink,
			// 						},
			// 						{
			// 							where: {
			// 								id: createdPdf.id,
			// 							},
			// 						}
			// 					);
			// 				}
			// 			);
			// 		});
			// 	await sleep(1000);
			// 	fs.unlinkSync(outputPdf);
			// 	fs.unlinkSync(outputQr);
			// 	fs.unlinkSync(fileThumbnail);

			// 	return res.sendJson(
			// 		201,
			// 		true,
			// 		"success upload new subject certificate"
			// 	);
			// });
		});
	}),
	// /**
	//  * @desc      Create new certificate TRAINING
	//  * @route     POST /api/v1/certificate/training
	//  * @access    Private
	//  */
	// createCertificateTraining: asyncHandler(async (req, res) => {
	// 	const { user_id, student_id, subject_id, id_certificate } = req.body;
	// 	const storage = getStorage();
	// 	const bucket = admin.storage().bucket();

	// 	const user = await User.findOne({
	// 		where: {
	// 			id: user_id,
	// 		},
	// 	});

	// 	const subject = await Subject.findOne({
	// 		where: {
	// 			id: subject_id,
	// 		},
	// 	});

	// 	const generateRandomCert = randomString.generate({
	// 		capitalization: "uppercase",
	// 		length: 12,
	// 		charset: "alphanumeric",
	// 	});

	// 	const certificateLink =
	// 		"www.kampusgratis.com/certificate/" + generateRandomCert;

	// 	const outputQr = `${generateRandomCert}.png`;

	// 	var qr_svg = qr.image(certificateLink, {
	// 		type: "png",
	// 		size: 6,
	// 		margin: 1,
	// 	});
	// 	qr_svg.pipe(fs.createWriteStream(outputQr));

	// 	const name = user.full_name;
	// 	const subjectName = subject.name;
	// 	const time = "12 Desember 2022";
	// 	const predikat = "SANGAT BAIK";
	// 	const nilai = 99;

	// 	const outputPdf = `${generateRandomCert}-${name}-certificat.pdf`;
	// 	pdfDocument.pipe(fs.createWriteStream(outputPdf));
	// 	pdfDocument.image("public/cert/pelatihan.png", {
	// 		fit: [3509, 2482],
	// 		align: "center",
	// 	});

	// 	await sleep(2000);
	// 	if (name.length <= 10) {
	// 		pdfDocument
	// 			.font("public/fonts/Monotype-Corsiva.ttf")
	// 			.fillColor("#623B60")
	// 			.fontSize(145)
	// 			.text(name, 1590, 875);
	// 	} else if (name.length <= 17) {
	// 		pdfDocument
	// 			.font("public/fonts/Monotype-Corsiva.ttf")
	// 			.fillColor("#623B60")
	// 			.fontSize(145)
	// 			.text(name, 1290, 875);
	// 	} else if (name.length <= 25) {
	// 		pdfDocument
	// 			.font("public/fonts/Monotype-Corsiva.ttf")
	// 			.fillColor("#623B60")
	// 			.fontSize(145)
	// 			.text(name, 1000, 875);
	// 	} else {
	// 		pdfDocument
	// 			.font("public/fonts/Monotype-Corsiva.ttf")
	// 			.fillColor("#623B60")
	// 			.fontSize(145)
	// 			.text(name, 825, 875);
	// 	}
	// 	pdfDocument
	// 		.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
	// 		.fillColor("#623B60")
	// 		.fontSize(85)
	// 		.text(subjectName, 1200, 1200);
	// 	pdfDocument
	// 		.font("public/fonts/SegoeUIVF.ttf")
	// 		.fillColor("black")
	// 		.fontSize(60)
	// 		.text(time, 1010, 1691);
	// 	pdfDocument
	// 		.font("public/fonts/Segoe-UI-Variable-Static-Display-Regular.ttf")
	// 		.fillColor("#3C4048")
	// 		.fontSize(40)
	// 		.text(certificateLink, 2400, 2360);
	// 	pdfDocument.image(outputQr, 3075, 2157);
	// 	pdfDocument
	// 		.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
	// 		.fillColor("#FBB416")
	// 		.fontSize(60)
	// 		.text(predikat, 1500, 1373);
	// 	pdfDocument
	// 		.font("public/fonts/Segoe-UI-Variable-Static-Display-Bold.ttf")
	// 		.fillColor("#FBB416")
	// 		.fontSize(60)
	// 		.text(nilai, 2227, 1373);

	// 	pdfDocument.end();
	// 	return res.sendJson(201, true, "success upload new certificate");

	// 	const stream = pdfDocument.pipe(blobStream());
	// 	// stream.on("finish", async () => {
	// 	// 	await sleep(2000);
	// 	// 	// upload to firebase storage
	// 	// 	const file = fs.readFileSync(outputPdf);
	// 	// 	const nameFile = "documents/certificate/" + outputPdf;
	// 	// 	const buffer = Buffer.from(file, "utf-8");

	// 	// 	bucket
	// 	// 		.file(nameFile)
	// 	// 		.createWriteStream()
	// 	// 		.end(buffer)
	// 	// 		.on("finish", () => {
	// 	// 			getDownloadURL(ref(storage, nameFile)).then((fileLink) => {
	// 	// 				console.log("link in firebase => ", fileLink);
	// 	// 			});

	// 	// 			return res.sendJson(201, true, "success upload new certificate");
	// 	// 		});

	// 	// 	await sleep(2000);
	// 	// 	fs.unlinkSync(outputPdf);
	// 	// 	fs.unlinkSync(outputQr);
	// 	// });
	// }),

	/**
	 * @desc      Get certificate by id certificate
	 * @route     GET /api/v1/certificate/:id_certificate
	 * @access    public
	 */
	getCertificate: asyncHandler(async (req, res) => {
		const { id_certificate } = req.params;
		const search = await Certificate.findOne({
			where: {
				id_certificate,
			},
			attributes: ["link", "thumbnail_link"],
			include: {
				model: Subject,
				as: "subject",
				attributes: ["name"],
			},
		});

		if (!search) {
			return res.sendJson(404, false, "certificate not found");
		}

		return res.sendJson(200, true, "success get certificate", search);
	}),

	/**
	 * @desc      Get certificate by student
	 * @route     GET /api/v1/certificate?page=(number)&limit=(number)&search=(str)
	 * @access    private
	 */
	getCertificateByStudent: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { page, limit, search } = req.query;
		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}
		let certificate = await Certificate.findAll({
			where: {
				student_id,
			},
			attributes: ["id_certificate", "subject_id", "link", "thumbnail_link"],
			include: {
				model: Subject,
				where: {
					name: {
						[Op.iLike]: search_query,
					},
				},
				as: "subject",
				attributes: ["name"],
			},
		});
		certificate = await pagination(certificate, page, limit);
		if (!certificate) {
			return res.sendJson(
				404,
				false,
				"searching certificate by id student not found"
			);
		}
		if (certificate === "Invalid") {
			return res.sendJson(404, false, "Page or limit is invalid");
		}
		return res.sendJson(
			200,
			true,
			"success get certificate by student",
			certificate
		);
	}),
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function letterByPercent(percent) {
	if (percent >= parseFloat(FLOOR_A)) {
		return "A";
	} else if (percent >= parseFloat(FLOOR_A_MINUS)) {
		return "A-";
	} else if (percent >= parseFloat(FLOOR_B_PLUS)) {
		return "B+";
	} else if (percent >= parseFloat(FLOOR_B)) {
		return "B";
	} else if (percent >= parseFloat(FLOOR_B_MINUS)) {
		return "B-";
	} else if (percent >= parseFloat(FLOOR_C_PLUS)) {
		return "C+";
	} else if (percent >= parseFloat(FLOOR_C)) {
		return "C";
	} else if (percent >= parseFloat(FLOOR_D)) {
		return "D";
	} else if (percent >= parseFloat(FLOOR_E)) {
		return "E";
	}
	return null;
}
