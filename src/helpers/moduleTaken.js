const { MaterialEnrolled , Module} = require("../models");
const {
	MODULE,
    FINISHED
} = process.env;

async function moduleTaken(student_id,session_id) {
    const module_in_session = await Module.findAll({
        attributes:['id'],
        where:{
            session_id
        }
    });
    for(i=0;i<module_in_session.length;i++){
        const material_enrolled = await MaterialEnrolled.findOne({
            attributes:[
                'status'
            ],  
            where:{ 
                student_id,
                session_id,
                type:MODULE,
                id_referrer: module_in_session[i].id
            }
        })
        if(material_enrolled?.status!==FINISHED){
            return {
                allowed: false,
                message: "Student isn't eligible to take the quiz"
            }
        }
    }
    return {
        allowed: true,
        message: "Student is eligible to take the quiz"
    }
}

module.exports = moduleTaken;