const { Service } = require("../models");
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
	 * @desc      create service request document
	 * @route     POST /api/v1/services/document
	 * @access    Private must be login without role
	 */
	createServiceDocument: asyncHandler(async (req, res) => {
		const { name, nim, email, message, priority } = req.body;

		const bucket = admin.storage().bucket();
		const storage = getStorage();

		const fileName =
			"documents/services/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const fileBuffer = req.file.buffer;

		bucket
			.file(fileName)
			.createWriteStream()
			.end(fileBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, fileName)).then(async (linkFile) => {
					const created = await Service.create({
						name,
						nim,
						email,
						message,
						priority,
						status: "pending",

						document: fileName,
						document_name: req.file.originalname,
						document_link: linkFile,
					});

					return await res.sendJson(
						201,
						true,
						"Service request created",
						created
					);
				});
			});
	}),
};
