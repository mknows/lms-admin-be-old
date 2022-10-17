async function checkExistence(Model,id) {
	const data = await Model.findOne({
		where:{
			id
		}
	});
	if(data) return true;
	else return false;
}
module.exports = checkExistence;