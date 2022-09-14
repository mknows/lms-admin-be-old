const { Lecturer } = require("../models");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      Action to Lecturer Administration (Aksi untuk Administrasi Dosen)
	 * @route     PUT /api/v1/my-study/administrations/:administrationId
	 * @access    Private (Admin)
	 */
	administrationAction: asyncHandler(async (res, res, next) => {
		const { administrationId } = req.params;
		const { action } = req.body;

		if (!action) return next(new ErrorResponse("Some fields is missing.", 400));
	}),
};
