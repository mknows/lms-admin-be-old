const ErrorResponse = require("../utils/errorResponse");

async function pagination(data, page, limit) {
	const intPage = parseInt(page);
	const intLimit = parseInt(limit);
	if (Number.isInteger(intPage) && Number.isInteger(intLimit)) {
		let firstIndex = (intPage - 1) * intLimit;
		if (firstIndex < 0) firstIndex = 0;
		let lastIndex = firstIndex + intLimit;

		const maxPage = Math.ceil(data.length / intLimit);
		if (typeof data === "object") {
			let result = data?.slice(firstIndex, lastIndex);
			return {
				total_data: data.length,
				max_page: maxPage,
				result: result,
			};
		} else {
			return "Data cannot be sliced";
		}
	} else if (!Number.isInteger(intPage) || !Number.isInteger(intLimit)) {
		return "Invalid";
	} else if (!intPage || !intLimit) {
		return data;
	}
}
module.exports = pagination;
