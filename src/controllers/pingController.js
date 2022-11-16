const asyncHandler = require("express-async-handler");

const { Subject } = require("../models");

module.exports = {
	testAPI: asyncHandler(async (req, res) => {
		const { nama } = req.body;

		let data = await Subject.findOne({
			where: {
				name: nama,
			},
		});

		return res.sendJson(200, true, "berhasil", data);
	}),
};
