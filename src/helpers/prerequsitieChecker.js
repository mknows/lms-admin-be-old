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
        return subject_taken;
    }
    catch(err){
        console.log(err)
    }
}
module.exports = prerequisiteChecker;