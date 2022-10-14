const { MaterialEnrolled,Session } = require("../models");
const {
	MODULE,
} = process.env;

async function completedModule(student_id,session_id) {
	const module_in_session = await MaterialEnrolled.findOne({
        where:{
            student_id,
            session_id,
            type:MODULE
        }
    });
    if(module_in_session) return true;
    else return false;
}

module.exports = completedModule;