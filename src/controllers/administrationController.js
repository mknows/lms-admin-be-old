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

		if (!data) {
			data = await Administration.create(
				{
					user_id: user.id,
					created_by: user.id,
					is_approved: "waiting",
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
			administration_id,

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

		// if (
		// 	!nin ||
		// 	!study_program ||
		// 	!semester ||
		// 	!nin_address ||
		// 	!residence_address ||
		// 	!birth_place ||
		// 	!birth_date ||
		// 	!phone ||
		// 	!gender ||
		// 	!nsn
		// ) {
		// 	return res.sendJson(400, false, "Some fields are missing.", {});
		// }

		let data = await Administration.findOne({
			where: {
				id: administration_id,
			},
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration Id.", {});
		}

		data = await Administration.update(
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
				is_approved: "waiting",
				approved_by: null,
			},
			{
				where: {
					id: administration_id,
				},
				include: User,
				returning: true,
				plain: true,
			}
		);

		data = await Administration.findOne({
			where: {
				id: administration_id,
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
			administration_id,

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

		// if (
		// 	!father_name ||
		// 	!father_occupation ||
		// 	!father_income ||
		// 	!mother_name ||
		// 	!mother_occupation ||
		// 	!mother_income ||
		// 	!occupation ||
		// 	!income ||
		// 	!living_partner ||
		// 	!financier
		// ) {
		// 	return res.sendJson(400, false, "Some fields are missing.", {});
		// }

		let data = await Administration.findOne({
			where: {
				id: administration_id,
			},
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration id", {});
		}

		data = await Administration.update(
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
					id: administration_id,
				},
				returning: true,
				plain: true,
			}
		);

		data = await Administration.findOne({
			where: {
				id: administration_id,
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

		const { administration_id } = req.body;

		if (!administration_id) {
			return res.sendJson(400, false, "no administration ID", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administration_id,
			},
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration ID", {});
		}

		const integrityPactFile =
			uuidv4() +
			"-" +
			req.files.integrity_pact[0].originalname.split(" ").join("-");
		const integrityPactBuffer = req.files.integrity_pact[0].buffer;

		const ninCardFile =
			uuidv4() + "-" + req.files.nin_card[0].originalname.split(" ").join("-");
		const ninCardBuffer = req.files.nin_card[0].buffer;

		const familyCardFile =
			uuidv4() +
			"-" +
			req.files.family_card[0].originalname.split(" ").join("-");
		const familyCardBuffer = req.files.family_card[0].buffer;

		const certificateFile =
			uuidv4() +
			"-" +
			req.files.certificate[0].originalname.split(" ").join("-");
		const certificateBuffer = req.files.certificate[0].buffer;

		const photoFile =
			uuidv4() + "-" + req.files.photo[0].originalname.split(" ").join("-");
		const photoBuffer = req.files.photo[0].buffer;

		const transcriptFile =
			uuidv4() +
			"-" +
			req.files.transcript[0].originalname.split(" ").join("-");
		const transcriptBuffer = req.files.transcript[0].buffer;

		const recommendationLetterFile =
			uuidv4() +
			"-" +
			req.files.recommendation_letter[0].originalname.split(" ").join("-");
		const recommendationLetterBuffer =
			req.files.recommendation_letter[0].buffer;

		const bucket = admin.storage().bucket();
		const storage = getStorage();

		bucket
			.file(`documents/${integrityPactFile}`)
			.createWriteStream()
			.end(integrityPactBuffer);
		bucket
			.file(`documents/${ninCardFile}`)
			.createWriteStream()
			.end(ninCardBuffer);
		bucket
			.file(`documents/${familyCardFile}`)
			.createWriteStream()
			.end(familyCardBuffer);
		bucket
			.file(`documents/${certificateFile}`)
			.createWriteStream()
			.end(certificateBuffer);
		bucket.file(`documents/${photoFile}`).createWriteStream().end(photoBuffer);
		bucket
			.file(`documents/${transcriptFile}`)
			.createWriteStream()
			.end(transcriptBuffer);
		bucket
			.file(`documents/${recommendationLetterFile}`)
			.createWriteStream()
			.end(recommendationLetterBuffer);

		data = await Administration.update(
			{
				updated_by: user.id,

				// file
				integrity_pact: `documents/${integrityPactFile}`,
				nin_card: `documents/${ninCardFile}`,
				family_card: `documents/${familyCardFile}`,
				certificate: `documents/${certificateFile}`,
				photo: `documents/${photoFile}`,
				transcript: `documents/${transcriptFile}`,
				recommendation_letter: `documents/${recommendationLetterFile}`,

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
		await sleep(1000);
		createLinkFirebaseIntegrityPact(integrityPactFile, administration_id);
		await sleep(1000);
		createLinkFirebaseNinCard(ninCardFile, administration_id);
		await sleep(1000);
		createLinkFirebaseFamilyCard(familyCardFile, administration_id);
		await sleep(1000);
		createLinkFirebaseCertificate(certificateFile, administration_id);
		await sleep(1000);
		createLinkFirebasePhoto(photoFile, administration_id);
		await sleep(1000);
		createLinkFirebaseTranscript(transcriptFile, administration_id);
		await sleep(1000);
		createLinkFirebaseRecommendationLetter(
			recommendationLetterFile,
			administration_id
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

		return res.sendJson(201, true, "Successfully uploaded files", {
			...data,
		});
	}),

	/**
	 * @desc      pick degree
	 * @route     PUT /api/v1/administrations/degree
	 * @access    Private (User)
	 */
	degreeAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const { administration_id, degree } = req.body;

		// if (!administration_id || !degree) {
		// 	return res.sendJson(400, false, "Some fields are missing.", {});
		// }

		let data = await Administration.update(
			{
				// non - file
				degree,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				include: User,
				where: {
					id: administration_id,
				},
			}
		);

		data = await Administration.findOne({
			where: {
				id: administration_id,
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

	//   /**
	//    * @desc      Insert Administration (Input Administrasi)
	//    * @route     POST /api/v1/administrations/create-administration
	//    * @access    Private (User)
	//    */
	//   createAdministration: asyncHandler(async (req, res, next) => {
	//     const user = req.userData;

	//     const {
	//       nin,
	//       study_program,
	//       semester,
	//       nin_address,
	//       residence_address,
	//       birth_place,
	//       birth_date,
	//       phone,
	//       gender,
	//       nsn,

	//       domicile,
	//       financier,
	//       father_name,
	//       mother_name,
	//       father_occupation,
	//       mother_occupation,
	//       job,
	//       income,
	//       father_income,
	//       mother_income,
	//     } = req.body;

	//     const integrityPactFile =
	//       uuidv4() +
	//       "-" +
	//       req.files.integrity_pact[0].originalname.split(" ").join("-");
	//     const integrityPactBuffer = req.files.integrity_pact[0].buffer;

	//     const ninCardFile =
	//       uuidv4() + "-" + req.files.nin_card[0].originalname.split(" ").join("-");
	//     const ninCardBuffer = req.files.nin_card[0].buffer;

	//     const familyCardFile =
	//       uuidv4() +
	//       "-" +
	//       req.files.family_card[0].originalname.split(" ").join("-");
	//     const familyCardBuffer = req.files.family_card[0].buffer;

	//     const certificateFile =
	//       uuidv4() +
	//       "-" +
	//       req.files.certificate[0].originalname.split(" ").join("-");
	//     const certificateBuffer = req.files.certificate[0].buffer;

	//     const photoFile =
	//       uuidv4() + "-" + req.files.photo[0].originalname.split(" ").join("-");
	//     const photoBuffer = req.files.photo[0].buffer;

	//     const transcriptFile =
	//       uuidv4() +
	//       "-" +
	//       req.files.transcript[0].originalname.split(" ").join("-");
	//     const transcriptBuffer = req.files.transcript[0].buffer;

	//     const recommendationLetterFile =
	//       uuidv4() +
	//       "-" +
	//       req.files.recommendation_letter[0].originalname.split(" ").join("-");
	//     const recommendationLetterBuffer =
	//       req.files.recommendation_letter[0].buffer;

	//     const bucket = admin.storage().bucket();

	//     bucket
	//       .file(`documents/${integrityPactFile}`)
	//       .createWriteStream()
	//       .end(integrityPactBuffer);
	//     bucket
	//       .file(`documents/${ninCardFile}`)
	//       .createWriteStream()
	//       .end(ninCardBuffer);
	//     bucket
	//       .file(`documents/${familyCardFile}`)
	//       .createWriteStream()
	//       .end(familyCardBuffer);
	//     bucket
	//       .file(`documents/${certificateFile}`)
	//       .createWriteStream()
	//       .end(certificateBuffer);
	//     bucket.file(`documents/${photoFile}`).createWriteStream().end(photoBuffer);
	//     bucket
	//       .file(`documents/${transcriptFile}`)
	//       .createWriteStream()
	//       .end(transcriptBuffer);
	//     bucket
	//       .file(`documents/${recommendationLetterFile}`)
	//       .createWriteStream()
	//       .end(recommendationLetterBuffer);

	//     const data = await Administration.create(
	//       {
	//         // non - file
	//         user_id: user.id,
	//         nin,
	//         study_program,
	//         semester,
	//         residence_address,
	//         nin_address,
	//         phone,
	//         birth_place,
	//         domicile,
	//         financier,
	//         father_name,
	//         mother_name,
	//         father_occupation,
	//         mother_occupation,
	//         job,
	//         income,
	//         father_income,
	//         mother_income,

	//         // file
	//         integrity_pact: `documents/${integrityPactFile}`,
	//         nin_card: `documents/${ninCardFile}`,
	//         family_card: `documents/${familyCardFile}`,
	//         certificate: `documents/${certificateFile}`,
	//         photo: `documents/${photoFile}`,
	//         transcript: `documents/${transcriptFile}`,
	//         recommendation_letter: `documents/${recommendationLetterFile}`,
	//         is_approved: "waiting",
	//         approved_by: null,
	//       },
	//       {
	//         include: User,
	//       }
	//     );

	//     await sleep(1000);
	//     createLinkFirebaseIntegrityPact(integrityPactFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebaseNinCard(ninCardFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebaseFamilyCard(familyCardFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebaseCertificate(certificateFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebasePhoto(photoFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebaseTranscript(transcriptFile, data.id);
	//     await sleep(1000);
	//     createLinkFirebaseRecommendationLetter(recommendationLetterFile, data.id);

	//     const asdasd = await Administration.findOne({
	//       where: { id: data.dataValues.id },
	//       include: [
	//         {
	//           model: User,
	//         },
	//       ],
	//       attributes: {
	//         exclude: ["user_id"],
	//       },
	//     });

	//     return res.sendJson(
	//       201,
	//       true,
	//       "Your administration has been submited.",
	//       asdasd
	//     );
	//   }),

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
		degree: data.degree,
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
	getDownloadURL(ref(storage, `documents/${file}`)).then(async (linkFile) => {
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
