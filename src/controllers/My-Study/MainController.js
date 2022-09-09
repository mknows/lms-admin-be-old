const { Subject, Major, Lecturer } = require("../../models");

module.exports = {
  /**
   * @desc      Get all the subject (Semua data Materi)
   * @route     GET /api/v1/my-study/subjects
   * @access    Global
   */
  getAllSubjects: async (req, res) => {
    try {
      const data = await Subject.findAll();

      return res.sendJson(200, true, "Search all subject successfully.", data);
    } catch (error) {
      console.error(error);
      return res.sendJson(500, false, error.message, {});
    }
  },

  /**
   * @desc      GET all the available majors (Semua data Jurusan)
   * @route     GET /api/v1/my-study/majors
   * @access    Global
   */
  getAllMajors: async (req, res) => {
    try {
      const data = await Major.findAll();

      return res.sendJson(200, true, "Search all major successfully.", data);
    } catch (error) {
      console.error(error);
      return res.sendJson(500, false, error.message, {});
    }
  },

  /**
   * @desc      GET all lecturers (Semua data Dosen)
   * @route     GET /api/v1/my-study/lecturers
   * @access    Global
   */
  getAllLecturers: async (req, res) => {
    try {
      const data = await Lecturer.findAll();

      return res.sendJson(200, true, "Search all lecturer successfully.", data);
    } catch (error) {
      console.error(error);
      return res.sendJson(500, false, error.message, {});
    }
  }
}