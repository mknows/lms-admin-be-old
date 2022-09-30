const ErrorResponse = require("../utils/errorResponse");

async function pagination(data, page, limit) {
	const intPage = parseInt(page);
	const intLimit = parseInt(limit);
	if (Number.isInteger(intPage) && Number.isInteger(intLimit)) {
		const firstIndex = (intPage - 1) * intLimit;
		const lastIndex = firstIndex + intLimit;
		const maxPage = Math.ceil(data.length / intLimit);
		if (typeof data === "object") {
			let result = data.slice(firstIndex, lastIndex);
			console.log("test");
			return {
				max_page: maxPage,
				result: result,
			};
		} else {
			return "Data cannot be sliced";
		}
	} else {
		return "Limit and / or Page is not an integer";
	}
}
module.exports = pagination;
