function pagination(data, page, limit) {
	const intPage = parseInt(page)
	const intLimit = parseInt(limit)
	if (Number.isInteger(intPage) && Number.isInteger(intLimit)) {
		const firstIndex = (intPage - 1) * intLimit;
		const lastIndex = firstIndex + intLimit;	
		const maxPage = Math.ceil(data.length/intLimit)
		if (typeof data === "object") {
			return [{maxPage : maxPage}, data.slice(firstIndex,lastIndex)];
		} else {
			return 	"error cannot be sliced";
		}
	} else {
		return "Limit or Page is not an integer";
	}
}
module.exports = pagination;
