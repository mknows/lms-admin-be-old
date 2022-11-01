const { Op } = require("sequelize");
const {
	Major,
	Subject,
	MajorSubject,
	StudentMajor,
	StudentSubject,
	Student,
	User,
	Lecturer,
} = require("../models");
const scoringController = require("../controllers/scoringController");
const {
	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
	INVALID,
	NOT_ENROLLED,

	QUIZ,
	MODULE,
} = process.env;
const getPlan = require("../helpers/getPlan");

async function getParsedPlan(student_id) {
	const subjectsEnrolled = await getPlan(student_id);

	const datapending = subjectsEnrolled.datapending;
	const dataongoing = subjectsEnrolled.dataongoing;
	const datadraft = subjectsEnrolled.datadraft;

	let draftres = [];
	let draftcred = 0;

	let pendingres = [];
	let pendingcred = 0;

	let ongoingres = [];
	let ongoingcred = 0;

	for (let i = 0; i < datapending.length; i++) {
		let currStudSub = datapending[i];

		let currSub = await Subject.findOne({
			where: {
				id: currStudSub.subject_id,
			},
		});

		pendingcred += currSub?.credit;

		let dataval = {
			name: currSub?.name,
			credit: currSub?.credit,
			subject_id: currSub?.id,
			student_subject_id: currStudSub.id,
		};

		pendingres.push(dataval);
	}

	for (let i = 0; i < dataongoing.length; i++) {
		let currStudSub = dataongoing[i];

		let currSub = await Subject.findOne({
			where: {
				id: currStudSub.subject_id,
			},
		});

		ongoingcred += currSub?.credit;

		let dataval = {
			name: currSub?.name,
			credit: currSub?.credit,
			subject_id: currSub?.id,
			student_subject_id: currStudSub.id,
		};

		ongoingres.push(dataval);
	}

	for (let i = 0; i < datadraft.length; i++) {
		let currStudSub = datadraft[i];
		console.log(currStudSub.subject_id);
		let currSub = await Subject.findOne({
			where: {
				id: currStudSub.subject_id,
			},
		});
		draftcred += currSub.credit;

		let dataval = {
			name: currSub.name,
			credit: currSub.credit,
			subject_id: currSub.id,
			student_subject_id: currStudSub.id,
		};

		draftres.push(dataval);
	}

	let total_plan_cred = pendingcred + ongoingcred + draftcred;

	return {
		pending: { subjects: pendingres, credit: pendingcred },
		ongoing: { subjects: ongoingres, credit: ongoingcred },
		draft: { subjects: draftres, credit: draftcred },
		total_credit: total_plan_cred,
	};
}
module.exports = getParsedPlan;
