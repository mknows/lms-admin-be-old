const { Subject,Prerequisite } = require("../models");

async function prerequisiteChecker(subject_id,student_id) {
	try{
        const subject_with_prereq = await Subject.findOne({
            where:{
                id:subject_id
            },
            include:{
                model:Subject,
                as:"prerequisite_subject"
            }
        })
        
        if(!subject_with_prereq.prerequisite_subject[0].Prerequisite) return {
            message: "Subject has no prerequisite",
            allowed: true
        }
        if(subject_with_prereq.prerequisite_subject[0].Prerequisite){
            const subject_taken = await Student.findOne({
                where:{
                    id:student_id
                },
                attributes:[],
                include:{
                    model:Subject,
                    where:{
                        subject_id: subject_with_prereq.prerequisite_subject[0].Prerequisite
                    },
                    attributes:['id']
                }
            });
            if(!subject_taken) return {
                message:"Student hasn't taken the prerequisite subject",
                allowed: false
            };
            if(subject_taken) return {
                message:"Student has taken the prerequisite subject",
                allowed: true
            };
        }

    }
    catch(err){
        console.log(err)
    }
}
module.exports = prerequisiteChecker;