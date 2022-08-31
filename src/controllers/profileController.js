const { User } = require("../models");

const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");
const { getAuth } = require("firebase-admin/auth");

module.exports = {
  /**
   * @desc      Get User Login Data (Profile)
   * @route     GET /api/v1/profile/me
   * @access    Private
   */
  getMe: async (req, res) => {
    try {
      let token = req.firebaseToken;
      let user = req.userData;
      if (!token || !user) return res.status(409).json({
        success: false,
        message: "Invalid authorization.",
        data: {}
      });
      const data = await User.findOne({
        where: {
          firebaseUID: user.firebaseUID
        },
        attributes: {
          exclude: ['id', 'firebaseUID', 'password']
        }
      });
      
      return res.status(200).json({
        success: true,
        message: "Account connected.",
        data: { ...data.dataValues }
      });
    } catch (error) {
      console.error(error);

      return res.status(403).json({
        success: false,
        message: "Something went wrong.",
        data: {}
      });
    }
  },

  /**
   * @desc      Update User Login Data (Profile)
   * @route     PUT /api/v1/profile/me
   * @access    Private
   */
  updateMe: async (req, res) => {
    try {
      let token = req.firebaseToken;
      let user = req.userData;

      if (!token || !user) return res.status(409).json({
        success: false,
        message: "Invalid authorization.",
        data: {}
      });
      
      const { fullName } = req.body;

      const data = await User.update({
        fullName: titleCase(fullName)
      }, {
        where: {
          firebaseUID: user.uid,
        },
        returning: true,
        plain: true
      });

      console.log("before data => ", data[1]);
      
      delete data[1].dataValues['id'];
      delete data[1].dataValues['firebaseUID'];
      delete data[1].dataValues['password'];

      console.log("after data => ", data[1]);

      await updateProfile(getClientAuth(), {
        fullName: titleCase(fullName)
      });

      return res.status(200).json({
        success: true,
        message: "Account connected.",
        data: { ...data[1].dataValues }
      });
    } catch (error) {
      console.error(error);

      return res.status(403).json({
        success: false,
        message: "Something went wrong.",
        data: {}
      });
    }
  }
}

// Usage for Capitalize Each Word
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

// Usage for Phone Number Validator (Firebase) (Example: +62 822 xxxx xxxx)
function phoneNumber(number) {
  var validationPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  if (number.value.match(validationPhone)) {
    return true;
  }
  else {
    alert("message");
    return false;
  }
}