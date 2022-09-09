const { User, Quiz } = require("../../../models");

module.exports = {
  /**
   * @desc      Get all Quiz that exist (Ambil Semua data Quiz)
   * @route     GET /api/v1/my-study/quizzes/
   * @access    Private
   */
  getQuizzes: async (req, res) => {
    try {
      const quizzes = await Quiz.findAll();

      return res.sendJson(200, true, "Get All Quiz Successfully.", quizzes);
    } catch (error) {
      console.error(error);
      return res.sendJson(500, false, error.message, {});
    }
  },
  /**
   * @desc      Insert Quiz (Tambah Quiz)
   * @route     POST /api/v1/my-study/quizzes/create-quiz/:studyId/:meetId/
   * @access    Private
   */
  createQuiz: async (req, res) => {
    try {
      const { question, choices, answer } = req.body;
      if (!question || !choices || !answer) return res.sendJson(400, false, "Some fields is missing.", {});

    } catch (error) {
      console.error(error);
      return res.sendJson(500, false, error.message, {});
    }
  },

  /**
   * @desc      Edit Quiz (Tambah Quiz)
   * @route     PUT /api/v1/my-study/quizzes/edit-quiz/:quizId/:meetId/
   * @access    Private
   */
  editQuiz: async (req, res) => {

  }
}