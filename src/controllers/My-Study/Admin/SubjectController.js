const { Subject } = require("../../../models");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../../utils/errorResponse");

module.exports = {
  /**
   * @desc      Insert new Study (Tambah data Materi)
   * @route     POST /api/v1/my-study/insert-study
   * @access    Private (Admin)
   */
  insertSubject: asyncHandler(async (req, res, next) => {
    const { name, description, number_of_sessions, lecturer_id, created_by, level, degree } = req.body;

    if (!name || !description || !number_of_sessions || !lecturer_id || !created_by || !level || !degree) return next(new ErrorResponse("Some fields is missing.", 400));

    if (!lecturer_id instanceof Array) return next(new ErrorResponse("Invalid lecturer_id.", 400));

    const data = await Subject.create({
      name, description, number_of_sessions,
      lecturer_id, level, degree, created_by
    });

    return res.sendJson(200, true, "Create New Study Success.", data.dataValues);
  }),

  /**
   * @desc      Edit Study by ID (Edit data Materi)
   * @route     PUT /api/v1/my-study/edit-study/:subjectId
   * @access    Private (Admin)
   */
  editSubject: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const { name, description, number_of_sessions, lecturer_id, created_by, level, degree } = req.body;

    if (!subjectId || !name || !description || !number_of_sessions || !lecturer_id || !created_by || !level || !degree) return res.status(400).json({
      success: false,
      message: "Some fields is missing.",
      data: {}
    });

    if (!lecturer_id instanceof Array) return res.status(400).json({
      success: false,
      message: "Invalid lecturer_id.",
      data: {}
    });

    const study = await Subject.findOne({
      where: { id: subjectId }
    });

    if (!study) return res.status(404).json({
      success: false,
      message: "Invalid subject_id.",
      data: {}
    });

    const data = await Subject.update({
      name, description, number_of_sessions,
      lecturer_id, created_by
    }, {
      where: { id: subjectId },
      returning: true,
      plain: true
    });

    return res.status(200).json({
      success: true,
      message: `Edit Subject with ID ${subjectId} successfully.`,
      data: { ...data[1].dataValues }
    });
  }),

  /**
   * @desc      Delete Study by ID (Hapus data Materi)
   * @route     DELETE /api/v1/my-study/edit-study/:subjectId
   * @access    Private (Admin)
   */
  removeSubject: asyncHandler(async (req, res, next) => {
    const { subjectId } = req.params;

    let data = await Subject.findOne({
      where: { id: subjectId }
    });

    if (!data) return res.status(404).json({
      success: false,
      message: "Invalid subject_id.",
      data: {}
    });

    Subject.destroy({
      where: { id: subjectId }
    });

    return res.status(200).json({
      success: true,
      message: `Delete Subject with ID ${subjectId} successfully.`,
      data: {}
    });
  })
}