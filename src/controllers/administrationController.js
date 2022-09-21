const asyncHandler = require("express-async-handler");
const { Administration, User } = require("../models");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");

module.exports = {
	/**
	 * @desc      Insert Administration for self data
	 * @route     POST /api/v1/administrations/self-data
	 * @access    Private (User)
	 */
	selfDataAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const {
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
		} = req.body;

		if (
			!nin ||
			!study_program ||
			!semester ||
			!nin_address ||
			!residence_address ||
			!birth_place ||
			!birth_date ||
			!phone ||
			!gender ||
			!nsn
		) {
			return res.sendJson(400, false, "Some fields is missing.", {});
		}

		const data = await Administration.create(
			{
				// non - file
				user_id: user.id,
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
				is_approved: "waiting",
				approved_by: null,
			},
			{
				include: User,
			}
		);

		return res.sendJson(
			200,
			true,
			"Successfully created administration with self data",
			data
		);
	}),
	/**
	 * @desc      Insert Administration for familial data
	 * @route     POST /api/v1/administrations/failial
	 * @access    Private (User)
	 */
	familialAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
			administrationId,

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

		if (
			!father_name ||
			!father_occupation ||
			!father_income ||
			!mother_name ||
			!mother_occupation ||
			!mother_income ||
			!occupation ||
			!income ||
			!living_partner ||
			!financier
		) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administrationId,
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
			},
			{
				where: {
					id: administrationId,
					returning: true,
					plain: true,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: `edited admin with ID ${administrationId} with familial data successfully.`,
			data,
		});
	}),

	/**
	 * @desc      Insert Administration files
	 * @route     POST /api/v1/administrations/files
	 * @access    Private (User)
	 */
	createAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const { administrationId } = req.body;

		if (!administrationId) {
			const files = req.files;

			Object.values(files).forEach((file) => {
				fs.unlink("./public/documents/" + `${file[0].filename}`, (err) => {
					if (err) {
						console.log(
							`failed to delete local image: ${file[0].fieldname}` + err
						);
					} else {
						console.log(
							`successfully deleted local image ${file[0].fieldname}`
						);
					}
				});
			});

			return res.sendJson(400, false, "no administration ID", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administrationId,
			},
		});
		if (!data) {
			return res.sendJson(400, false, "invalid administration ID", {});
		}

		const data = await Administration.update(
			{
				// file
				integrity_fact: req.files.integrity_fact[0].filename,
				nin_card: req.files.nin_card[0].filename,
				family_card: req.files.family_card[0].filename,
				sertificate: req.files.sertificate[0].filename,
				photo: req.files.photo[0].filename,
				transcript: req.files.transcript[0].filename,
				recomendation_letter: req.files.recomendation_letter[0].filename,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				where: { id: administrationId },
				returning: true,
				plain: true,
				include: User,
			}
		);

		const data = await Administration.findOne({
			where: { id: data.id },
			include: [
				{
					model: User,
				},
			],
			attributes: {
				exclude: ["user_id"],
			},
		});

		return res.sendJson(201, true, "Your administration has been submited.", {
			...data,
		});
	}),

	/**
	 * @desc      Insert Administration (Input Administrasi)
	 * @route     POST /api/v1/administrations/create-administration
	 * @access    Private (User)
	 */
	createAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
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

			domicile,
			financier,
			father_name,
			mother_name,
			father_occupation,
			mother_occupation,
			job,
			income,
			father_income,
			mother_income,
		} = req.body;

		if (
			!nin ||
			!study_program ||
			!semester ||
			!residence_address ||
			!nin_address ||
			!phone ||
			!birth_place ||
			!domicile ||
			!financier ||
			!father_name ||
			!mother_name ||
			!father_occupation ||
			!mother_occupation ||
			!job ||
			!income ||
			!father_income ||
			!mother_income
		) {
			const files = req.files;

			Object.values(files).forEach((file) => {
				fs.unlink("./public/documents/" + `${file[0].filename}`, (err) => {
					if (err) {
						console.log(
							`failed to delete local image: ${file[0].fieldname}` + err
						);
					} else {
						console.log(
							`successfully deleted local image ${file[0].fieldname}`
						);
					}
				});
			});

			return res.sendJson(400, false, "Some fields is missing.", {});
		}

		const data = await Administration.create(
			{
				// non - file
				user_id: user.id,
				nin,
				study_program,
				semester,
				residence_address,
				nin_address,
				phone,
				birth_place,
				domicile,
				financier,
				father_name,
				mother_name,
				father_occupation,
				mother_occupation,
				job,
				income,
				father_income,
				mother_income,

				// file
				integrity_pact: req.files.integrity_fact[0].filename,
				nin_card: req.files.nin_card[0].filename,
				family_card: req.files.family_card[0].filename,
				sertificate: req.files.sertificate[0].filename,
				photo: req.files.photo[0].filename,
				transcript: req.files.transcript[0].filename,
				recomendation_letter: req.files.recomendation_letter[0].filename,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				include: User,
			}
		);

		const data = await Administration.findOne({
			where: { id: data.dataValues.id },
			include: [
				{
					model: User,
				},
			],
			attributes: {
				exclude: ["user_id"],
			},
		});

		return res.sendJson(201, true, "Your administration has been submited.", {
			...data.dataValues,
		});
	}),
};
