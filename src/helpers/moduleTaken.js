const { MaterialEnrolled} = require("../models");
const {
	MODULE,
} = process.env;

async function moduleTaken(student_id,session_id) {
	const module_in_session = await MaterialEnrolled.findAll({
        attributes:['status'],
        where:{
            student_id,
            session_id,
            type:MODULE
        }
    });
    console.log(module_in_session.status)
}

module.exports = moduleTaken;