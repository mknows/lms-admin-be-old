const { Lecturer, User, Student } = require("../models");

module.exports = (req, res, next) => {
	res.checkExistence = async (id, role) => {
		switch (role) {
			case "user": {
				message = await checkUser(id);
				console.log(message);
				break;
			}
			case "lecturer": {
				message = checkLecturer(id);
				break;
			}
			case "student": {
				message = checkStudent(id);
				break;
			}
			default:
				message = "Role doesn't exists.";
		}
	};

	next();
};

async function checkUser(id) {
	const query = await User.findOne({
		where: {
			id: id,
		},
	});
	if (query === null) {
		return "User Not Found";
	}
	return "Success";
}
async function checkLecturer(id) {
	const query = await Lecturer.findOne({
		where: {
			id: id,
		},
	});
	if (query === null) {
		return "User Not Found";
	}
	return "Success";
}
async function checkStudent(id) {
	const query = await Student.findOne({
		where: {
			id: id,
		},
	});
	if (query === null) {
		return "User Not Found";
	}
	return "Success";
}
