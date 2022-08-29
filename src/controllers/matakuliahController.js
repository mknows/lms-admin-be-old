const { User,mata_kuliah} = require("../models");
const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");
const { getAuth } = require("firebase-admin/auth");

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
  /**
   * @desc      Get Matakuliah murid
   * @route     GET /api/v1/studiku/matakuliahMurid
   * @access    Private
   */
  getMatakuliahMurid: async (req,res) => {
    try {
      let token = req.firebaseToken;
      let user = req.userData;
      console.log(user.uid)
      
      res.sendJson(200,true,"test",[token,user])
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  }
};