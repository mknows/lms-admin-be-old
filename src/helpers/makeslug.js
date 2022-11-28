async function makeSlug(input, slug) {
	if (slug) {
		return input.replace(/ /gi, "-");
	}
	return input.replace(/-/gi, " ");
}

module.exports = makeSlug;
