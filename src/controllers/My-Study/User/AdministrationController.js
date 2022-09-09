const asyncHandler = require("express-async-handler");
const { Administration, User } = require("../../../models");
const ErrorResponse = require("../../../utils/errorResponse");
const fs = require('fs');

module.exports = {
  /**
   * @desc      Insert Administration (Input Administrasi)
   * @route     POST /api/v1/my-study/administrations/create-administration
   * @access    Private (User)
   */
  createAdministration: asyncHandler(async (req, res, next) => {
    const user = req.userData;

    const {
      nin, study_program, semester, residence_address, nin_address, phone, birth_place,
      domicile, financier, father_name, mother_name, father_occupation, mother_occupation, job, income,
      father_income, mother_income
    } = req.body;

    if (!nin || !study_program || !semester || !residence_address || !nin_address || !phone || !birth_place
      || !domicile || !financier || !father_name || !mother_name || !father_occupation || !mother_occupation || !job || !income
      || !father_income || !mother_income
    ) {
      const files = req.files;

      Object.values(files).forEach(file => {
        fs.unlink("./public/documents/" + `${file[0].filename}`, (err) => {
          if (err) {
            console.log(`failed to delete local image: ${file[0].fieldname}` + err);
          } else {
            console.log(`successfully deleted local image ${file[0].fieldname}`);
          }
        });
      });

      return res.sendJson(400, false, "Some fields is missing.", {});
    }

    const data = await Administration.create({
      // non - file
      user_id: user.id,
      nin, study_program, semester, residence_address, nin_address, phone, birth_place,
      domicile, financier, father_name, mother_name, father_occupation, mother_occupation, job, income,
      father_income, mother_income,

      // file
      integrity_fact: req.files.integrity_fact[0].filename,
      nin_card: req.files.nin_card[0].filename,
      family_card: req.files.family_card[0].filename,
      sertificate: req.files.sertificate[0].filename,
      photo: req.files.photo[0].filename,
      transcript: req.files.transcript[0].filename,
      recomendation_letter: req.files.recomendation_letter[0].filename,

      is_approved: "waiting",
      approved_by: null
    }, {
      include: User
    });

    const asdasd = await Administration.findOne({
      where: { id: data.dataValues.id }, include: [{
        model: User
      }], attributes: {
        exclude: ['user_id']
      }
    });

    return res.sendJson(201, true, "Your administration has been submited.", { ...asdasd.dataValues });
  })
}