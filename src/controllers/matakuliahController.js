const { user,mata_kuliah} = require("../models");

module.exports = {
  /**
   * @desc      Get All Matakuliah
   * @route     GET /api/v1/studiku/all
   * @access    Public
   */
  getAllMatakuliah: async (req, res) => {
    try {
      const data = await mata_kuliah.findAll();
      res.sendJson(200, true, "sucess get all data", data);
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  },

  
};