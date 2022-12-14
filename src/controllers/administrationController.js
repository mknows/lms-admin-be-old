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
const { Op } = require("sequelize");

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

		const eligible = await checkAdminDataAprooved("biodata", exist.id);

		if (eligible.status === false) {
			return res.sendJson(400, false, eligible.message, {});
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

		const eligible = await checkAdminDataAprooved("familial", exist.id);

		if (eligible.status === false) {
			return res.sendJson(400, false, eligible.message, {});
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
		// const { administration_id } = req.body;

		let data = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});
		const administration_id = data.id;

		if (!data) {
			return res.sendJson(400, false, "invalid administration user data", {});
		}

		const eligible = await checkAdminDataAprooved("files", data.id);

		if (eligible.status === false) {
			return res.sendJson(400, false, eligible.message, {});
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

		// ?Add new optional
		if (req.files.integrity_pact) {
			const integrityPactFile = nameFile(req.files.integrity_pact);
			const integrityPactBuffer = req.files.integrity_pact[0].buffer;

			bucket
				.file(integrityPactFile)
				.createWriteStream()
				.end(integrityPactBuffer)
				.on("finish", () => {
					createLinkFirebaseIntegrityPact(integrityPactFile, administration_id);
				});
			await Administration.update(
				{
					integrity_pact: integrityPactFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		// ?Add new optional nin_cart
		if (req.files.nin_card) {
			const ninCardFile = nameFile(req.files.nin_card);
			const ninCardBuffer = req.files.nin_card[0].buffer;

			bucket
				.file(ninCardFile)
				.createWriteStream()
				.end(ninCardBuffer)
				.on("finish", () => {
					createLinkFirebaseNinCard(ninCardFile, administration_id);
				});

			await Administration.update(
				{
					nin_card: ninCardFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		// ?Add new optional family_card
		if (req.files.family_card) {
			const familyCardFile = nameFile(req.files.family_card);
			const familyCardBuffer = req.files.family_card[0].buffer;

			bucket
				.file(familyCardFile)
				.createWriteStream()
				.end(familyCardBuffer)
				.on("finish", () => {
					createLinkFirebaseFamilyCard(familyCardFile, administration_id);
				});

			await Administration.update(
				{
					family_card: familyCardFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		// ?Add new optional certificate
		if (req.files.certificate) {
			const certificateFile = nameFile(req.files.certificate);
			const certificateBuffer = req.files.certificate[0].buffer;

			bucket
				.file(certificateFile)
				.createWriteStream()
				.end(certificateBuffer)
				.on("finish", () => {
					createLinkFirebaseCertificate(certificateFile, administration_id);
				});

			await Administration.update(
				{
					certificate: certificateFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		if (req.files.photo) {
			const photoFile = nameFile(req.files.photo);
			const photoBuffer = req.files.photo[0].buffer;

			bucket
				.file(photoFile)
				.createWriteStream()
				.end(photoBuffer)
				.on("finish", () => {
					createLinkFirebasePhoto(photoFile, administration_id);
				});

			await Administration.update(
				{
					photo: photoFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		data = await Administration.update(
			{
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

		const eligible = await checkAdminDataAprooved("degree", exist.id);

		if (eligible.status === false) {
			return res.sendJson(400, false, eligible.message, {});
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
	 * @desc      update all administration data if exist
	 * @route     PUT /api/v1/administrations/all
	 * @access    Private (User)
	 */
	updateAllDataAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const {
			// biodata
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

			// familial
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

		const bucket = admin.storage().bucket();

		const dataAdministration = await Administration.findOne({
			where: {
				user_id: user.id,
			},
			include: User,
		});

		if (!dataAdministration) {
			return res.sendJson(400, false, "invalid administration id", {});
		}

		const eligible = await checkAdminDataAprooved("all", dataAdministration.id);

		if (eligible.status === false) {
			return res.sendJson(400, false, eligible.message, {});
		}

		const administration_id = dataAdministration.id;

		const data = await Administration.update(
			{
				// biodata
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

				// familial
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
				include: User,
				returning: true,
				plain: true,
			}
		);
		// update file if exist
		// file integrity pact
		if (req.files.integrity_pact) {
			checkIfExistFirebase(dataAdministration.integrity_pact);

			const integrityPactFile = nameFile(req.files.integrity_pact);
			const integrityPactBuffer = req.files.integrity_pact[0].buffer;

			bucket
				.file(integrityPactFile)
				.createWriteStream()
				.end(integrityPactBuffer)
				.on("finish", () => {
					createLinkFirebaseIntegrityPact(integrityPactFile, administration_id);
				});
			await Administration.update(
				{
					integrity_pact: integrityPactFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}
		// file ktp
		if (req.files.nin_card) {
			checkIfExistFirebase(dataAdministration.nin_card);

			const ninCardFile = nameFile(req.files.nin_card);
			const ninCardBuffer = req.files.nin_card[0].buffer;

			bucket
				.file(ninCardFile)
				.createWriteStream()
				.end(ninCardBuffer)
				.on("finish", () => {
					createLinkFirebaseNinCard(ninCardFile, administration_id);
				});

			await Administration.update(
				{
					nin_card: ninCardFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}
		// file recommendation letter
		if (req.files.recommendation_letter) {
			checkIfExistFirebase(dataAdministration.recommendation_letter);

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
		// file transcript
		if (req.files.transcript) {
			checkIfExistFirebase(dataAdministration.transcript);

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
		// file family card
		if (req.files.family_card) {
			checkIfExistFirebase(dataAdministration.family_card);

			const familyCardFile = nameFile(req.files.family_card);
			const familyCardBuffer = req.files.family_card[0].buffer;

			bucket
				.file(familyCardFile)
				.createWriteStream()
				.end(familyCardBuffer)
				.on("finish", () => {
					createLinkFirebaseFamilyCard(familyCardFile, administration_id);
				});

			await Administration.update(
				{
					family_card: familyCardFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}
		// file certificate
		if (req.files.certificate) {
			checkIfExistFirebase(dataAdministration.certificate);

			const certificateFile = nameFile(req.files.certificate);
			const certificateBuffer = req.files.certificate[0].buffer;

			bucket
				.file(certificateFile)
				.createWriteStream()
				.end(certificateBuffer)
				.on("finish", () => {
					createLinkFirebaseCertificate(certificateFile, administration_id);
				});

			await Administration.update(
				{
					certificate: certificateFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}
		// file photo
		if (req.files.photo) {
			checkIfExistFirebase(dataAdministration.photo);

			const photoFile = nameFile(req.files.photo);
			const photoBuffer = req.files.photo[0].buffer;

			bucket
				.file(photoFile)
				.createWriteStream()
				.end(photoBuffer)
				.on("finish", () => {
					createLinkFirebasePhoto(photoFile, administration_id);
				});

			await Administration.update(
				{
					photo: photoFile,
				},
				{
					where: { id: administration_id },
					returning: true,
					plain: true,
					include: User,
				}
			);
		}

		return res.sendJson(200, true, "update last data administration success", {
			administration: data,
		});
	}),

	/**
	 * @desc      Delete data Administration
	 * @route     DELETE /api/v1/administrations/delete/:id
	 * @access    Private (User)
	 */
	deleteAdministration: asyncHandler(async (req, res) => {
		const { id } = req.params;

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

		checkIfExistFirebase(getFiles.integrity_pact);
		checkIfExistFirebase(getFiles.nin_card);
		checkIfExistFirebase(getFiles.family_card);
		checkIfExistFirebase(getFiles.certificate);
		checkIfExistFirebase(getFiles.photo);
		checkIfExistFirebase(getFiles.transcript);
		checkIfExistFirebase(getFiles.recommendation_letter);

		await Administration.destroy({
			where: {
				id,
			},
		});

		return res.sendJson(200, true, "succes delete administration");
	}),

	/**
	 * @desc      Delete per file Administration
	 * @route     DELETE /api/v1/administrations/delete/file?integrity_pact=
	 * @access    Private (User)
	 */
	deleteFileAdministration: asyncHandler(async (req, res) => {
		const {
			integrity_pact,
			nin_card,
			family_card,
			certificate,
			photo,
			transcript,
			recommendation_letter,
		} = req.query;
		const storage = getStorage();

		if (integrity_pact) {
			const searchingFile = await Administration.findOne({
				where: {
					integrity_pact,
				},
			});
			if (searchingFile.integrity_pact) {
				await deleteObject(ref(storage, searchingFile.integrity_pact))
					.then(() => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file integrity_pact"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						integrity_pact: null,
						integrity_pact_link: null,
					},
					{
						where: {
							integrity_pact,
						},
					}
				);
			}
		}

		if (nin_card) {
			const searchingFile = await Administration.findOne({
				where: {
					nin_card,
				},
			});

			if (searchingFile.nin_card) {
				await deleteObject(ref(storage, searchingFile.nin_card))
					.then(async () => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file nin_card"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						nin_card: null,
						nin_card_link: null,
					},
					{
						where: {
							nin_card,
						},
					}
				);
			}
		}

		if (family_card) {
			const searchingFile = await Administration.findOne({
				where: {
					family_card,
				},
			});

			if (searchingFile.family_card) {
				await deleteObject(ref(storage, searchingFile.family_card))
					.then(() => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file family_card"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						family_card: null,
						family_card_link: null,
					},
					{
						where: {
							family_card,
						},
					}
				);
			}
		}

		if (certificate) {
			const searchingFile = await Administration.findOne({
				where: {
					certificate,
				},
			});

			if (searchingFile.certificate) {
				await deleteObject(ref(storage, searchingFile.certificate))
					.then(() => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file certificate"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						certificate: null,
						certificate_link: null,
					},
					{
						where: {
							certificate,
						},
					}
				);
			}
		}

		if (photo) {
			const searchingFile = await Administration.findOne({
				where: {
					photo,
				},
			});

			if (searchingFile.photo) {
				await deleteObject(ref(storage, searchingFile.photo))
					.then(() => {
						return res.sendJson(200, true, "success deleteObject file photo");
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						photo: null,
						photo_link: null,
					},
					{
						where: {
							photo,
						},
					}
				);
			}
		}
		if (transcript) {
			const searchingFile = await Administration.findOne({
				where: {
					transcript,
				},
			});

			if (searchingFile.transcript) {
				await deleteObject(ref(storage, searchingFile.transcript))
					.then(() => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file transcript"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						transcript: null,
						transcript_link: null,
					},
					{
						where: {
							transcript,
						},
					}
				);
			}
		}

		if (recommendation_letter) {
			const searchingFile = await Administration.findOne({
				where: {
					recommendation_letter,
				},
			});

			if (searchingFile.recommendation_letter) {
				await deleteObject(ref(storage, searchingFile.recommendation_letter))
					.then(() => {
						return res.sendJson(
							200,
							true,
							"success deleteObject file recommendation_letter"
						);
					})
					.catch((err) => {
						return res.sendJson(
							400,
							false,
							"failed deleteObject in firebase, maybe file was deleted"
						);
					});

				await Administration.update(
					{
						recommendation_letter: null,
						recommendation_letter_link: null,
					},
					{
						where: {
							recommendation_letter,
						},
					}
				);
			}
		}
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

const checkIfExistFirebase = async (data) => {
	const storage = getStorage();
	if (data) {
		await deleteObject(ref(storage, data))
			.then(() => {
				console.log("success deleteObject");
			})
			.catch(() => {
				console.log("file maybe was deleted");
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

const checkAdminDataAprooved = async (type, administration_id) => {
	let result;
	let admin_data = await Administration.findOne({
		where: {
			id: administration_id,
		},
	});

	let aprooval_status = admin_data.is_approved;

	if (aprooval_status.overall === true) {
		return (result = {
			status: false,
			message: "All administration data has already been aprooved",
		});
	}
	let comp = aprooval_status.component;
	if (comp.biodata === true && type === "biodata") {
		return {
			status: false,
			message: "Not eligible for change, biodata has been aprooved",
		};
	}
	if (comp.familial === true && type === "familial") {
		return {
			status: false,
			message: "Not eligible for change, familial data has been aprooved",
		};
	}
	if (comp.files === true && type === "files") {
		return {
			status: false,
			message: "Not eligible for change, files data has been aprooved",
		};
	}
	if (comp.degree === true && type === "degree") {
		return {
			status: false,
			message: "Not eligible for change, degree data has been aprooved",
		};
	}
	return {
		status: true,
		message: "eligible for change, data in question has not been aprooved",
	};
};
