const asyncHandler = require("express-async-handler");
const { Administration, User } = require("../models");
const ErrorResponse = require("../utils/errorResponse");
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
	 * @desc      Initiate admin data
	 * @route     GET /api/v1/administration/mine
	 * @access    Private (User)
	 */
	getCurrentUserAdminData: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		let data = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		let approval = {
			component: {
				biodata: false,
				familial: false,
				files: false,
				degree: false,
			},
			overall: false,
		};

		const comp = approval.component;

		if (comp.biodata && comp.familial && comp.files && comp.degree) {
			approval.overall = true;
		}

		if (!data) {
			data = await Administration.create(
				{
					user_id: user.id,
					created_by: user.id,
					is_approved: approval,
					approved_by: null,
				},
				{
					include: User,
				}
			);

			const ret_data = await sortData(data);

			return res.sendJson(
				200,
				true,
				"Successfully created administration of user",
				ret_data
			);
		}

		const ret_data = await sortData(data);

		return res.sendJson(
			200,
			true,
			"Successfully retrieved administration of user",
			ret_data
		);
	}),
	/**
	 * @desc      Insert Administration for self data
	 * @route     PUT /api/v1/administration/biodata
	 * @access    Private (User)
	 */
	selfDataAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
			full_name,
			email,
			nin,
			study_program,
			semester,
			nin_address,
			residence_address,
			birth_place,
			birth_date,
			phone,
			gender,
			nsn,
			university_of_origin,
		} = req.body;

		const exist = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		if (!exist) {
			return res.sendJson(400, false, "invalid administration user data.", {});
		}

		let data = await Administration.update(
			{
				// non - file
				full_name,
				email,
				nin,
				study_program,
				semester,
				nin_address,
				residence_address,
				birth_place,
				birth_date,
				phone,
				gender,
				nsn,
				university_of_origin,

				updated_by: user.id,
			},
			{
				where: {
					id: exist.id,
				},
				include: User,
				returning: true,
				plain: true,
			}
		);

		data = await Administration.findOne({
			where: {
				id: exist.id,
			},
			exclude: ["user_id"],
		});

		const ret_data = await sortData(data);

		return res.sendJson(
			200,
			true,
			"Successfully created administration with self data",
			ret_data
		);
	}),
	/**
	 * @desc      Insert Administration for familial data
	 * @route     PUS /api/v1/administration/familial
	 * @access    Private (User)
	 */
	familialAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
			father_name,
			father_occupation,
			father_income,
			mother_name,
			mother_occupation,
			mother_income,

			occupation,
			income,
			living_partner,
			financier,
		} = req.body;

		const exist = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		if (!exist) {
			return res.sendJson(400, false, "invalid administration id", {});
		}

		let data = await Administration.update(
			{
				father_name,
				father_occupation,
				father_income,
				mother_name,
				mother_occupation,
				mother_income,

				occupation,
				income,
				living_partner,
				financier,

				updated_by: user.id,
			},
			{
				where: {
					id: exist.id,
				},
				returning: true,
				plain: true,
			}
		);

		data = await Administration.findOne({
			where: {
				id: exist.id,
			},
			exclude: ["user_id"],
		});

		const ret_data = await sortData(data);

		return res.sendJson(
			200,
			true,
			"Successfully created administration with self data",
			ret_data
		);
	}),

	/**
	 * @desc      Insert Administration files
	 * @route     PUT /api/v1/administration/files
	 * @access    Private (User)
	 */
	filesAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const storage = getStorage();
		const bucket = admin.storage().bucket();
		const { administration_id } = req.body;

		let data = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration user data", {});
		}

		checkIfExistFirebase(data.integrity_pact);
		checkIfExistFirebase(data.nin_card);
		checkIfExistFirebase(data.family_card);
		checkIfExistFirebase(data.certificate);
		checkIfExistFirebase(data.photo);
		checkIfExistFirebase(data.transcript);
		checkIfExistFirebase(data.recommendation_letter);

		// ? optional
		if (req.files.transcript) {
			const transcriptFile = nameFile(req.files.transcript);
			const transcriptBuffer = req.files.transcript[0].buffer;

			bucket
				.file(transcriptFile)
				.createWriteStream()
				.end(transcriptBuffer)
				.on("finish", () => {
					createLinkFirebaseTranscript(transcriptFile, administration_id);
				});

			await Administration.update(
				{
					updated_by: user.id,
					transcript: transcriptFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}
		// ? optional
		if (req.files.recommendation_letter) {
			const recommendationLetterFile = nameFile(
				req.files.recommendation_letter
			);
			const recommendationLetterBuffer =
				req.files.recommendation_letter[0].buffer;

			bucket
				.file(recommendationLetterFile)
				.createWriteStream()
				.end(recommendationLetterBuffer)
				.on("finish", () => {
					createLinkFirebaseRecommendationLetter(
						recommendationLetterFile,
						administration_id
					);
				});

			await Administration.update(
				{
					updated_by: user.id,
					recommendation_letter: recommendationLetterFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		// required
		const integrityPactFile = nameFile(req.files.integrity_pact);
		const integrityPactBuffer = req.files.integrity_pact[0].buffer;

		const ninCardFile = nameFile(req.files.nin_card);
		const ninCardBuffer = req.files.nin_card[0].buffer;

		const familyCardFile = nameFile(req.files.family_card);
		const familyCardBuffer = req.files.family_card[0].buffer;

		const certificateFile = nameFile(req.files.certificate);
		const certificateBuffer = req.files.certificate[0].buffer;

		const photoFile = nameFile(req.files.photo);
		const photoBuffer = req.files.photo[0].buffer;

		bucket
			.file(integrityPactFile)
			.createWriteStream()
			.end(integrityPactBuffer)
			.on("finish", () => {
				createLinkFirebaseIntegrityPact(integrityPactFile, administration_id);
			});
		bucket
			.file(ninCardFile)
			.createWriteStream()
			.end(ninCardBuffer)
			.on("finish", () => {
				createLinkFirebaseNinCard(ninCardFile, administration_id);
			});
		bucket
			.file(familyCardFile)
			.createWriteStream()
			.end(familyCardBuffer)
			.on("finish", () => {
				createLinkFirebaseFamilyCard(familyCardFile, administration_id);
			});
		bucket
			.file(certificateFile)
			.createWriteStream()
			.end(certificateBuffer)
			.on("finish", () => {
				createLinkFirebaseCertificate(certificateFile, administration_id);
			});
		bucket
			.file(photoFile)
			.createWriteStream()
			.end(photoBuffer)
			.on("finish", () => {
				createLinkFirebasePhoto(photoFile, administration_id);
			});

		data = await Administration.update(
			{
				updated_by: user.id,

				// file
				integrity_pact: integrityPactFile,
				nin_card: ninCardFile,
				family_card: familyCardFile,
				certificate: certificateFile,
				photo: photoFile,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				where: { id: administration_id },
				returning: true,
				plain: true,
				include: User,
			}
		);

		data = await Administration.findOne({
			where: { id: administration_id },
			include: [
				{
					model: User,
				},
			],
			attributes: {
				exclude: ["user_id"],
			},
		});

		return res.sendJson(201, true, "Successfully uploaded files");
	}),

	/**
	 * @desc      pick degree
	 * @route     PUT /api/v1/administrations/degree
	 * @access    Private (User)
	 */
	degreeAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const { degree } = req.body;

		const exist = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		if (!exist) {
			return res.sendJson(400, false, "invalid administration id", {});
		}

		let data = await Administration.update(
			{
				// non - file
				degree: degree,
			},
			{
				include: User,
				where: {
					id: exist.id,
				},
			}
		);

		data = await Administration.findOne({
			where: {
				id: exist.id,
			},
			exclude: ["user_id"],
		});

		const ret_data = await sortData(data);

		return res.sendJson(
			200,
			true,
			"Successfully created administration with degree",
			ret_data
		);
	}),

	/**
	 * @desc      Delete data Administration
	 * @route     DELETE /api/v1/administrations/delete/:id
	 * @access    Private (User)
	 */
	deleteAdministration: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const storage = getStorage();

		const findAdministration = await Administration.findOne({
			where: {
				id,
			},
		});

		if (findAdministration == null) {
			return res.sendJson(404, false, "administration not found");
		}

		const getFiles = await Administration.findOne({
			where: {
				id,
			},
			attributes: [
				"integrity_pact",
				"nin_card",
				"family_card",
				"certificate",
				"photo",
				"transcript",
				"recommendation_letter",
			],
		});

		let arrFile = Object.values(getFiles.dataValues);

		arrFile.map((file) => {
			deleteObject(ref(storage, file));
		});

		await Administration.destroy({
			where: {
				id,
			},
		});

		return res.sendJson(200, true, "succes delete administration");
	}),
};

async function sortData(data) {
	const ret_data = {
		administration_id: data.id,
		degree: data.degree,
		biodata: {
			full_name: data.full_name,
			email: data.email,
			nin: data.nin,
			study_program: data.study_program,
			semester: data.semester,
			nin_address: data.nin_address,
			residence_address: data.residence_address,
			birth_place: data.birth_place,
			birth_date: data.birth_date,
			phone: data.phone,
			gender: data.gender,
			nsn: data.nsn,
			university_of_origin: data.university_of_origin,
		},
		familial: {
			father_name: data.father_name,
			father_occupation: data.father_occupation,
			father_income: data.father_income,
			mother_name: data.mother_name,
			mother_occupation: data.mother_occupation,
			mother_income: data.mother_income,

			occupation: data.occupation,
			income: data.income,
			living_partner: data.living_partner,
			financier: data.financier,
		},
		files: {
			integrity_pact: data.integrity_pact,
			nin_card: data.nin_card,
			family_card: data.family_card,
			certificate: data.certificate,
			photo: data.photo,
			transcript: data.transcript,
			recommendation_letter: data.recommendation_letter,
		},

		is_approved: data.is_approved,
		approved_by: data.approved_by,
	};

	return ret_data;
}

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

const createLinkFirebaseIntegrityPact = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				integrity_pact_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebaseNinCard = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				nin_card_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebaseFamilyCard = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				family_card_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebaseCertificate = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				certificate_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebasePhoto = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				photo_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebaseTranscript = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				transcript_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const createLinkFirebaseRecommendationLetter = (file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, file)).then(async (linkFile) => {
		await Administration.update(
			{
				recommendation_letter_link: linkFile,
			},
			{
				where: {
					id,
				},
			}
		);
	});
};

const checkIfExistFirebase = async (res, data) => {
	const storage = getStorage();
	if (data) {
		await deleteObject(ref(storage, data))
			.then(() => {
				console.log("success deleteObject");
			})
			.catch(err, () => {
				return res.sendJson(400, false, "failed upload", err);
			});
	}
};

const nameFile = (file_name) => {
	return (
		"documents/administrations/" +
		uuidv4() +
		"-" +
		file_name[0].originalname.split(" ").join("-")
	);
};
