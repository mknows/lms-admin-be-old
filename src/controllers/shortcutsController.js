const { fromBuffer } = require("pdf2pic");
const {
  Subject,
  Session,
  Module,
  Quiz,
  Assignment,
  Document,
  Video,
  Student,
  Major,
} = require("../models");
require("dotenv").config();
const {
  DRAFT,
  PENDING,
  ONGOING,
  GRADING,
  PASSED,
  FAILED,
  FINISHED,
  ABANDONED,

  MAX_CREDIT,
} = process.env;
const asyncHandler = require("express-async-handler");
const admin = require("firebase-admin");

module.exports = {
  /**
   * @desc      make a full subject
   * @route     POST /api/v1/makesubjectcomplete/
   * @access    Public
   */
  createSubjectComplete: asyncHandler(async (req, res) => {
    let data;
    const num_sess = 4;
    const { name, description } = req.body;
    const lecturer = ["15e98720-3f94-11ed-b878-0242ac120002"];

    // const sub = await Subject.create({
    //   name: name,
    //   number_of_sessions: num_sess,
    //   level: "BASIC",
    //   lecturer: lecturer,
    //   description: description,
    //   credit: 3,
    //   degree: "S1",
    //   subject_code: makesubjectCode(name),
    // });

    const subs = await Subject.findAll();
    console.log(subs);

    for (let i = 0; i < subs.length; i++) {
      var sub = subs[i];
      for (let i = 0; i < num_sess; i++) {
        let typer =
          i + 1 == Math.floor(num_sess / 2)
            ? "MIDTERM"
            : i + 1 == num_sess
            ? "FINAL"
            : "REGULAR";
        let session = await Session.create({
          subject_id: sub.id,
          session_no: i + 1,
          duration: 10000,
          is_sync: true,
          type: typer,
          description: description,
        });
        let session_id = session.id;
        await fillSession(session_id);
      }
    }
    data = subs;

    return res.sendJson(200, true, "message", data);
  }),

  /**
   * @desc      delete all user
   * @route     POST /api/v1/shortcuts/nukeusers
   * @access    Public
   */
  makeMajor: asyncHandler(async (req, res) => {
    const { name, description, thumbnail, thumbnail_link } = req.body;
    // const { users } = await admin.auth().listUsers(1000);
    // const actual_password = "lukas123321passworddeleteuserdarifirebase";

    const { head_of_major, faculty } = def_major;

    // if (password === actual_password) {
    // 	return res.sendJson(401, false, "wrong pass bro");
    // }

    const major = await Major.create({
      name: name,
      thumbnail: thumbnail,
      thumbnail_link: thumbnail_link,
      description: description,
      head_of_major: head_of_major,
      faculty: faculty,
    });
    return res.sendJson(200, true, "message", major);
  }),

  /**
   * @desc      delete all user
   * @route     DELETE /api/v1/auth/nukeusers
   * @access    Public
   */
  deleteAllFirebaseUser: asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { users } = await admin.auth().listUsers(1000);
    const actual_password = "lukas123321passworddeleteuserdarifirebase";

    if (password === actual_password) {
      return res.sendJson(401, false, "wrong pass bro");
    }

    users.map(async (user) => {
      // KODE HARAM
      await admin.auth().deleteUser(user.uid);
    });

    return res.json({ users });
  }),

  /**
   * @desc      delete all user
   * @route     DELETE /api/v1/auth/nukeusers
   * @access    Public
   */
  makeUserToStudent: asyncHandler(async (req, res) => {
    const { password, user_id } = req.body;
    const actual_password = "lukas123321passwordconvertusertostudent";

    // if (password === actual_password) {
    // 	return res.sendJson(401, false, "wrong pass bro");
    // }

    const stud = await Student.create({
      user_id: user_id,
      semester: 1,
      supervisor: user_id,
    });

    return res.sendJson(200, true, "message", stud);
  }),
};

async function makeQuizShort(session_id) {
  const { duration, description, questions, answer } = def_quiz;

  await Quiz.create({
    session_id: session_id,
    duration: duration,
    description: description,
    questions: questions,
    answer: answer,
  });
}

async function makeAssignmentShort(session_id) {
  const {
    duration,
    description,
    content,
    file_assignment,
    file_assignment_link,
  } = def_assignment;

  await Assignment.create({
    session_id: session_id,
    duration: duration,
    description: description,
    content: content,
    file_assignment: file_assignment,
    file_assignment_link: file_assignment_link,
  });
}

async function fillSession(session_id) {
  const { document_id, video_id } = def_module;

  await Module.create({
    session_id: session_id,
    video_id: video_id,
    document_id: document_id,
  });

  await makeQuizShort(session_id);
  await makeAssignmentShort(session_id);
  return true;
}

function makesubjectCode(name) {
  let code = name + Date.now();
  return code;
}

const def_major = {
  faculty: "095629b0-ffa9-4984-8a7e-7994401b5d5f",
  head_of_major: "15e98720-3f94-11ed-b878-0242ac120002",
  thumbnail:
    "images/thumbnail_major/d1e77652-9fc3-4f1e-93bb-34849cac7a71-bussiness.jpg",
  thumbnail_link:
    "https://firebasestorage.googleapis.com/v0/b/kampus-gratis2.appspot.com/o/images%2Fthumbnail_major%2Fd1e77652-9fc3-4f1e-93bb-34849cac7a71-bussiness.jpg?alt=media&token=e59e3cd9-2a9b-4c7a-9c7e-8d495e7af46d",
};

const def_module = {
  document_id: ["4728fb12-54da-11ed-bdc3-0242ac120002"],
  video_id: ["0d7f3b88-54df-11ed-bdc3-0242ac120002"],
};

const def_quiz = {
  duration: 10000,
  description: "EXAM",
  questions: [
    {
      question: "Apakah bernegosiasi benar benar baik?",
      choices: ["ya", "tidak"],
    },
    {
      question: "Apa bukan etika bernegosiasi?",
      choices: ["harus profesional", "kekanak-kanakan"],
    },
  ],
  answer: ["ya", "kekanak-kanakan"],
};

const def_assignment = {
  duration: 10000,
  description: "description",
  content: "this is content",
  file_assignment: null,
  file_assignment_link: null,
};
