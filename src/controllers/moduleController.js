const { Module, Video, Document, Material } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
  /**
   * @desc      Get Module
   * @route     GET /api/v1/module/get/:id
   * @access    Private
   */
  getModule: async (req, res) => {
    try {
      const moduleID = req.params.id;
      const mod = await Module.findOne({
        where: {
          id: moduleID,
        },
      });
      res.sendJson(200, true, "Success", mod);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
  /**
   * @desc      Get video
   * @route     GET /api/v1/module/video/:id
   * @access    Private
   */
  getVideo: async (req, res) => {
    try {
      const videoID = req.params.id;
      const vid = await Video.findOne({
        where: {
          id: videoID,
        },
      });
      res.sendJson(200, true, "Success", vid);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
  /**
   * @desc      Get document
   * @route     GET /api/v1/module/document/:id
   * @access    Private
   */
  getDocument: async (req, res) => {
    try {
      const documentID = req.params.id;
      const doc = await Document.findOne({
        where: {
          id: documentID,
        },
      });
      res.sendJson(200, true, "Success", doc);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
  /**
   * @desc      post make module
   * @route     POST /api/v1/module/create
   * @access    Private
   */
  postModule: async (req, res) => {
    const { session_id, video_id, document_id } = req.body;

    try {
      const modcr = await Module.create({
        session_id: session_id,
        video_id: video_id,
        document_id: document_id,
      });

      await Material.create({
        session_id: session_id,
        type: "MODULE",
        id_referrer: modcr.id,
      });

      res.sendJson(200, true, "Success", modcr);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
  /**
   * @desc      post make video
   * @route     POST /api/v1/module/createvideo
   * @access    Private
   */
  postVideo: async (req, res) => {
    const { url, description } = req.body;

    try {
      const vidcr = await Video.create({
        url: url,
        description: description,
      });

      res.sendJson(200, true, "Success", vidcr);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
  /**
   * @desc      post make video
   * @route     POST /api/v1/module/createdocument
   * @access    Private
   */
  postDocument: async (req, res) => {
    const { content, file, description } = req.body;

    try {
      const doccr = await Document.create({
        content: content,
        file: file,
        description: description,
      });

      res.sendJson(200, true, "Success", doccr);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },
};
