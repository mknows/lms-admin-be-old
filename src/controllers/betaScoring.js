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

  Quiz,
  Assignment,
  Module,
} = require("../models");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
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

  console.log("dadadda")

  result = all_data;

  return result;
};