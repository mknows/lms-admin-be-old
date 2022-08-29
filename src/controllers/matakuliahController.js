const { User,subject} = require("../models");
const moment = require('moment')

module.exports = {
  /**
   * @desc      Get All Matakuliah
   * @route     GET /api/v1/studiku/all
   * @access    Public
   */
  getAllMatakuliah: async (req, res) => {
    try {
      const data = await subject.findAll();
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
      const testUser= await User.findOne({
        where: {
          firebaseUID: user.uid
        },
        include: subject
      });
      const testSubject= await subject.findOne({
        where: {
          id: '5'
        }
      });
      console.log(await testUser.getSubject())
      res.sendJson(200,true,"test",[token,user])
    } catch (err) {
      res.sendJson(500, false, err.message, null);
    }
  }
};