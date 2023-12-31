const {
	Administration,

	Student,
	Lecturer,
	User,

	MajorSubject,
	StudentMajor,
	Major,

	StudentSubject,
	Subject,

	StudentSession,
	Session,

	DiscussionForum,
	Comment,
	Reply,

	MaterialEnrolled,
	StudentDatapool,

	Quiz,
	Assignment,
	Module,
} = require("../models");
require("dotenv").config();
const {
	WEIGHT_A,
	WEIGHT_A_MINUS,
	WEIGHT_B_PLUS,
	WEIGHT_B,
	WEIGHT_B_MINUS,
	WEIGHT_C_PLUS,
	WEIGHT_C,
	WEIGHT_C_MINUS,
	WEIGHT_D,
	WEIGHT_E,

	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
	NOT_ENROLLED,
	INVALID,

	FLOOR_A,
	FLOOR_A_MINUS,
	FLOOR_B_PLUS,
	FLOOR_B,
	FLOOR_B_MINUS,
	FLOOR_C_PLUS,
	FLOOR_C,
	FLOOR_D,
	FLOOR_E,

	KKM,

	MODULE,
	QUIZ,
	ASSIGNMENT,

	QUIZ_WEIGHT_SESSION,
	ASSIGNMENT_WEIGHT_SESSION,
	MODULE_WEIGHT_SESSION,

	UTS,
	UAS,

	ASSIGNMENT_WEIGHT_ALL,
	QUIZ_WEIGHT_ALL,
	ATTENDANCE_WEIGHT_ALL,
	MIDTERM_WEIGHT,
	FINALS_WEIGHT,

	STUDENT_LIKE_WEIGHT,
	LECTURER_LIKE_WEIGHT,
} = process.env;
const { Op, fn, col } = require("sequelize");
const certificateController = require("../controllers/certificateController");
const getParsedPlan = require("../helpers/getParsedPlan");
const leaderboardFunctions = require("./leaderboardFunctions");

exports.getTotalLikesScore = async (student_like, lecturer_like) => {
	return (
		student_like * STUDENT_LIKE_WEIGHT + lecturer_like * LECTURER_LIKE_WEIGHT
	);
};

exports.getLikesReportTest = async (user_id) => {
	let result;

	let author_id = user_id;

	let all_data = await Promise.all([
		await DiscussionForum.findAll({
			where: {
				author_id,
			},
			attributes: [
				[fn("SUM", fn("CARDINALITY", col("student_like"))), "n_student_like"],
				[fn("SUM", fn("CARDINALITY", col("teacher_like"))), "n_teacher_like"],
			],
		}),
		await Comment.findAll({
			where: {
				author_id,
			},
			attributes: [
				[fn("SUM", fn("CARDINALITY", col("student_like"))), "n_student_like"],
				[fn("SUM", fn("CARDINALITY", col("teacher_like"))), "n_teacher_like"],
			],
		}),
		await Reply.findAll({
			where: {
				author_id,
			},
			attributes: [
				[fn("SUM", fn("CARDINALITY", col("student_like"))), "n_student_like"],
				[fn("SUM", fn("CARDINALITY", col("teacher_like"))), "n_teacher_like"],
			],
		}),
	]);

	result = all_data;

	return result;
};

exports.getGPA = async (student_id) => {
	let score = 0;
	let total_cred = 0;

	let enr = await StudentSubject.findAll({
		where: {
			student_id: student_id,
			status: GRADING,
		},
	});

	for (let i = 0; i < enr.length; i++) {
		let cursub = await Subject.findOne({
			id: enr[i].subject_id,
		});
		score += scoreByLetter(enr[i].final_score, cursub.credit);
		total_cred += cursub.credit;
	}

	let result = score / total_cred;

	return result;
};

exports.getSubjectProgress = async (student_id, subject_id) => {
	let progress = 0;

	let donelen = 0;
	let totallen = 0;

	let done = await Session.findAll({
		where: {
			subject_id: subject_id,
		},
		include: {
			model: Student,
			where: {
				id: student_id,
			},
			through: {
				where: {
					present: true,
				},
			},
		},
	});

	let total = await Session.findAll({
		where: {
			subject_id: subject_id,
		},
	});

	if (done !== null) {
		donelen = done.length;
	}
	if (total !== null) {
		totallen = total.length;
	}

	if (donelen >= 0 && totallen > 0) {
		progress = (donelen / totallen) * 100;
		progress = Math.round(progress);
	}

	return progress;
};

exports.getSubjectScoreV2 = async (student_id, subject_id) => {
	let score = 0;

	let sub = await Subject.findOne({
		where: { id: subject_id },
	});

	let sessions = await Session.findAll({
		where: {
			subject_id: sub.id,
			[Op.not]: { type: [UTS, UAS], session_no: 0 },
		},
	});

	let sesh_id_list = [];

	for (let i = 0; i < sessions.length; i++) {
		sesh_id_list.push(sessions[i].id);
	}

	let quiz_pool = 0;
	let assignment_pool = 0;
	let module_pool = 0;

	let material_all = await Promise.all([
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id: sesh_id_list,
				status: [PASSED, FINISHED, FAILED],
				type: QUIZ,
			},
		}),
		await Quiz.findAll({
			where: {
				session_id: sesh_id_list,
			},
		}),
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id: sesh_id_list,
				status: FINISHED,
				type: ASSIGNMENT,
			},
		}),
		await Assignment.findAll({
			where: {
				session_id: sesh_id_list,
			},
		}),
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id: sesh_id_list,
				status: FINISHED,
				type: MODULE,
			},
		}),
		await Module.findAll({
			where: {
				session_id: sesh_id_list,
			},
		}),
	]);

	// calculate total quiz score
	for (let i = 0; i < material_all[0].length; i++) {
		curr_mat = material_all[0][i];

		quiz_pool += curr_mat?.score;
	}
	let counter = material_all[1].length;
	quiz_pool = quiz_pool / counter;

	// calculate total assignment score
	for (let i = 0; i < material_all[2].length; i++) {
		curr_mat = material_all[2][i];

		assignment_pool += curr_mat?.score;
	}
	counter = material_all[3].length;
	assignment_pool = assignment_pool / counter;

	// calculate module / attendance score
	for (let i = 0; i < material_all[4].length; i++) {
		curr_mat = material_all[4][i];

		module_pool += curr_mat?.score;
	}
	counter = material_all[5].length;
	module_pool = module_pool / counter;

	let session_midterm = await Session.findOne({
		where: {
			subject_id: sub.id,
			type: UTS,
		},
	});

	let midterm_score = await MaterialEnrolled.findOne({
		where: {
			session_id: session_midterm.id,
			student_id,
			type: QUIZ,
		},
		attributes: ["score"],
	});
	midterm_score = midterm_score?.score || 0;

	let session_finals = await Session.findOne({
		where: {
			subject_id: sub.id,
			type: UAS,
		},
	});
	let finals_score = await MaterialEnrolled.findOne({
		where: {
			session_id: session_finals.id,
			student_id,
			type: QUIZ,
		},
		attributes: ["score"],
	});
	finals_score = finals_score?.score || 0;

	let final_subject_score =
		(parseFloat(QUIZ_WEIGHT_ALL) / 100) * quiz_pool +
		(parseFloat(ASSIGNMENT_WEIGHT_ALL) / 100) * assignment_pool +
		(parseFloat(ATTENDANCE_WEIGHT_ALL) / 100) * module_pool +
		(parseFloat(MIDTERM_WEIGHT) / 100) * midterm_score +
		(parseFloat(FINALS_WEIGHT) / 100) * finals_score;

	final_subject_score = parseFloat(final_subject_score);

	if (finals_score) {
		await StudentSubject.update(
			{
				status: FINISHED,
			},
			{
				where: {
					student_id,
					subject_id,
				},
			}
		);
		let data = {
			student_id,
			subject_id,
			final_subject_score,
		};
		const status = await certificateController.createCertificateSubject(data);
	}

	let stud_sub = await StudentSubject.update(
		{
			final_score: final_subject_score,
		},
		{
			where: {
				subject_id,
				student_id,
			},
		}
	);

	return score;
};

exports.getSubjectScore = async (student_id, subject_id) => {
	let score = 0;

	let sub = await Subject.findOne({
		where: { id: subject_id },
		attributes: ["number_of_sessions"],
	});

	let finished_sessions = await Student.findOne({
		where: {
			id: student_id,
		},
		include: {
			model: Session,
			where: {
				subject_id: subject_id,
			},
			through: {
				attributes: ["final_score"],
			},
		},
	});

	if (!finished_sessions) {
		return 0;
	}
	for (let i = 0; i < finished_sessions.Sessions.length; i++) {
		let curr_sesh = finished_sessions.Sessions[i].StudentSession;
		let curr_score = curr_sesh.final_score;
		if (curr_score == null) {
			curr_score = 0;
		}

		score += curr_score;
	}

	// TODO: ASSUMING EVERY SESSION IS EQUAL
	score = score / sub.number_of_sessions;

	return score;
};

exports.getSessionScore = async (student_id, session_id) => {
	let sesh = await Session.findOne({
		where: {
			id: session_id,
		},
	});

	let materials = await Promise.all([
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id,
				type: MODULE,
			},
		}),
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id,
				type: QUIZ,
			},
		}),
		await MaterialEnrolled.findAll({
			where: {
				student_id,
				session_id,
				type: ASSIGNMENT,
			},
		}),
	]);

	let material_score = [];

	for (let i = 0; i < materials.length; i++) {
		let dat_val = 0;
		let amount = 0;
		for (let j = 0; j < materials[i].length; j++) {
			let curr_score = materials[i][j].score;

			if (curr_score == null) {
				curr_score = 0;
			}
			dat_val += curr_score;
			amount += 1;
		}
		material_score.push(dat_val / amount);
	}
	let final_score = 0;

	if (sesh.type === UTS || sesh.type === UAS) {
		final_score = materials[1][0].score;
	} else {
		final_score +=
			(material_score[0] * parseFloat(MODULE_WEIGHT_SESSION)) / 100;
		final_score += (material_score[1] * parseFloat(QUIZ_WEIGHT_SESSION)) / 100;
		final_score +=
			(material_score[2] * parseFloat(ASSIGNMENT_WEIGHT_SESSION)) / 100;
	}

	return final_score;
};

exports.getPredicate = async (percent) => {
	return letterByPercent(percent);
};

exports.getStudentGPA = async (student_id) => {
	let result = null;

	const student = await Student.findOne({
		where: {
			id: student_id,
		},
		include: [
			{
				model: Subject,
				through: {
					where: {
						status: FINISHED,
					},
				},
			},
		],
	});

	let gpa = parseFloat(
		(await GPACalculatorFromList(student.Subjects)).toFixed(2)
	);

	result = gpa;
	return result;
};

exports.getReportSemestrial = async (student_id) => {
	const student = await Student.findOne({
		where: {
			id: student_id,
		},
		include: [
			{
				model: User,
				include: { model: Administration },
			},
			{
				model: Major,
			},
			{
				model: Subject,
				through: {
					where: {
						status: FINISHED,
					},
				},
			},
		],
	});

	let parsedPlan = await getParsedPlan(student_id);

	let student_information = {
		student_name: student?.User?.full_name,
		nsn: student?.User?.Administration?.nsn,
		major: student?.Majors[0].name,
		semester: student?.semester,
		credit_finished: parsedPlan.finished.credit,
		subjects_finished: parsedPlan.finished.subjects.length,
		gpa: parseFloat((await GPACalculatorFromList(student.Subjects)).toFixed(2)),
	};

	// TODO GPA TESTS #######
	user_id = await leaderboardFunctions.getUserId(student_id, "STUDENT");
	await leaderboardFunctions.updateLeaderboardGPA(
		user_id,
		student_information.gpa
	);

	const current_student_semester = student_information.semester;

	let subject_promises = [];

	for (let i = 0; i < current_student_semester; i++) {
		subject_promises.push(
			StudentSubject.findAll({
				where: {
					semester: i,
					student_id: student_id,
				},
				attributes: {
					exclude: ["student_id", "proof", "proof_link"],
				},
			})
		);

		subject_promises.push(
			StudentDatapool.findOne({
				where: {
					student_id: student_id,
					semester: i,
				},
				attributes: ["gpa", "id", "semester"],
			})
		);
	}

	const raw_student_report = await Promise.all(subject_promises);

	let final_report = [];

	let total_credit_finished = 0;
	for (let i = 0; i < raw_student_report.length; i += 2) {
		var subject_data = raw_student_report[i];
		var analytic_data = raw_student_report[i + 1];
		var total_credit_finished_this_semester = 0;
		var total_credit_taken_this_semester = 0;

		let current_semester =
			analytic_data?.semester == null ? 0 : analytic_data?.semester;
		let current_analytics_id =
			analytic_data?.id == null ? null : analytic_data?.id;
		let current_gpa = analytic_data?.gpa == null ? 0.0 : analytic_data?.gpa;

		for (let j = 0; j < subject_data.length; j++) {
			const subject_j = await Subject.findOne({
				where: {
					id: subject_data[j].subject_id,
				},
			});
			subject_data[j].dataValues.subject_name = subject_j.name;
			subject_data[j].dataValues.credit = subject_j.credit;

			if (subject_data[j].status === FINISHED) {
				total_credit_finished_this_semester += subject_j.credit;
			}
			total_credit_taken_this_semester += subject_j.credit;
		}
		total_credit_finished += total_credit_finished_this_semester;

		let semestrial_data = {
			semester: current_semester,
			analytics_id: current_analytics_id,
			gpa: current_gpa,
			semester_credit_taken: total_credit_taken_this_semester,
			semester_credit_finished: total_credit_finished_this_semester,
			overall_credit_taken: total_credit_finished,
			subject_data: subject_data,
		};
		final_report.push(semestrial_data);
	}

	let result = {
		student_information: student_information,
		report: final_report,
	};
	return result;
};

exports.getReport = async (student_id) => {
	const student = await Student.findOne({
		where: {
			id: student_id,
		},
		include: [
			{
				model: User,
				include: { model: Administration },
			},
			{
				model: Major,
			},
			{
				model: Subject,
				through: {
					where: {
						status: FINISHED,
					},
				},
			},
		],
	});

	let parsedPlan = await getParsedPlan(student_id);

	let student_information = {
		student_name: student?.User?.full_name,
		nsn: student?.User?.Administration?.nsn,
		major: student?.Majors[0].name,
		semester: student?.semester,
		credit_finished: parsedPlan.finished.credit,
		subjects_finished: parsedPlan.finished.subjects.length,
		gpa: parseFloat((await GPACalculatorFromList(student.Subjects)).toFixed(2)),
	};

	// TODO GPA TESTS #######
	user_id = await leaderboardFunctions.getUserId(student_id, "STUDENT");
	await leaderboardFunctions.updateLeaderboardGPA(
		user_id,
		student_information.gpa
	);

	let subjects = [];

	for (let i = 0; i < student.Subjects.length; i++) {
		let currsub = student.Subjects[i];
		let currsub_enrollment_data = currsub.StudentSubject;
		let subject = {
			name: currsub.name,
			credit: currsub.credit,
			score: currsub_enrollment_data.final_score,
			semester: currsub_enrollment_data.semester,
			predicate: letterByPercent(currsub_enrollment_data.final_score),
		};
		subjects.push(subject);
	}

	let result = {
		student_information: student_information,
		subject: subjects,
	};
	return result;
};

exports.submitLateQuizAsFail = async (material_enrolled_id) => {};

exports.isQuizLate = async (material_enrolled_id) => {
	const enroll_data = await MaterialEnrolled.findOne(material_enrolled_id);

	const quiz_id = enroll_data.id_referrer;
	const quiz = await Quiz.findOne(quiz_id);

	const date_now = new Date();

	var deadline = CalculateDeadline(enroll_data.created_at, quiz.duration);
	var isLate = isOverDeadline(deadline, date_now);

	return isLate;
};

async function CalculateDeadline(start, duration) {
	const deadline = new Date(new Date(start).getTime() + duration * 1000);
	return deadline;
}

async function isOverDeadline(deadline, date) {
	return moment(date).isAfter(deadline) ? true : false;
}

async function GPACalculatorFromList(subject_list) {
	let score = 0;
	let total_cred = 0;

	if (subject_list == null) {
		return 0;
	}

	for (let i = 0; i < subject_list.length; i++) {
		let curr_sub = subject_list[i];
		score += GPAWeightByLetter(
			letterByPercent(curr_sub.StudentSubject.final_score),
			curr_sub.credit
		);
		total_cred += curr_sub.credit;
	}

	let result;
	result = score / total_cred;
	result = isNaN(result) ? 0 : result;

	return result;
}

function letterByPercent(percent) {
	if (percent >= parseFloat(FLOOR_A)) {
		return "A";
	} else if (percent >= parseFloat(FLOOR_A_MINUS)) {
		return "A-";
	} else if (percent >= parseFloat(FLOOR_B_PLUS)) {
		return "B+";
	} else if (percent >= parseFloat(FLOOR_B)) {
		return "B";
	} else if (percent >= parseFloat(FLOOR_B_MINUS)) {
		return "B-";
	} else if (percent >= parseFloat(FLOOR_C_PLUS)) {
		return "C+";
	} else if (percent >= parseFloat(FLOOR_C)) {
		return "C";
	} else if (percent >= parseFloat(FLOOR_D)) {
		return "D";
	} else if (percent >= parseFloat(FLOOR_E)) {
		return "E";
	}
	return null;
}

function GPAWeightByLetter(letter, credit) {
	if (letter === "A") {
		return parseFloat(WEIGHT_A) * credit;
	} else if (letter === "A-") {
		return parseFloat(WEIGHT_A_MINUS) * credit;
	} else if (letter === "B+") {
		return parseFloat(WEIGHT_B_PLUS) * credit;
	} else if (letter === "B") {
		return parseFloat(WEIGHT_B) * credit;
	} else if (letter === "B-") {
		return parseFloat(WEIGHT_B_MINUS) * credit;
	} else if (letter === "C+") {
		return parseFloat(WEIGHT_C_PLUS) * credit;
	} else if (letter === "C") {
		return parseFloat(WEIGHT_C) * credit;
	} else if (letter === "C-") {
		return parseFloat(WEIGHT_C_MINUS) * credit;
	} else if (letter === "D") {
		return parseFloat(WEIGHT_D) * credit;
	} else if (letter === "E") {
		return parseFloat(WEIGHT_E) * credit;
	}
	return null;
}
