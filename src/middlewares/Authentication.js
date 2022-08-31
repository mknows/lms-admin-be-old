const { getAuth } = require("firebase-admin/auth");
const { User } = require("../models");

/**
 * @desc      Middleware for user authentication
 * @route     -
 * @access    Private
 */
exports.protection = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token || token == undefined) return res.status(409).json({
    success: false,
    message: "Invalid authorization.",
    data: {}
  });

  try {
    const user = await getAuth().verifyIdToken(token)
    if (!user) return res.status(409).json({
      success: false,
      message: "Invalid authorization.",
      data: {}
    });

    req.firebaseToken = token;
    req.firebaseData = user;

    let { dataValues }= await User.findOne({
      where:{
        email:user.email
      }
    });
    req.userData = dataValues;

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      success: false,
      message: "Something went wrong.",
      data: {}
    });
  }
}