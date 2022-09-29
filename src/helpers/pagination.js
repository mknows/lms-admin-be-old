function pagination(data, offset, limit) {
	if (Number.isInteger(limit) && Number.isInteger(offset)) {
		const firstIndex = (offset - 1) * limit;
		const lastIndex = firstIndex + limit;
		if (typeof data === "object") {
			return data.slice(firstIndex, lastIndex);
		} else {
			return "error cannot be sliced";
		}
	} else {
		return "limit or offset is not an integer";
	}
}
module.exports = pagination;
