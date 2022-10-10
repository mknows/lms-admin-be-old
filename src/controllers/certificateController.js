const { StudentSubject, Certificate } = require("../models");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

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

		const nameFile =
			"documents/certificate/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const bufferFile = req.file.buffer;

		bucket
			.file(nameFile)
			.createWriteStream()
			.end(bufferFile)
			.on("finish", () => {
				getDownloadURL(ref(storage, nameFile)).then(async (fileLink) => {
					await Certificate.create({
						user_id,
						student_id,
						subject_id,
						id_certificate,
						file: nameFile,
						link: fileLink,
					});

					return res.sendJson(201, true, "success upload new certificate");
				});
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
