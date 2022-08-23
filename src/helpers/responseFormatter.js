module.exports = (req, res, next) => {
  res.sendJson = (statusCode, status, message, data = {}) => {
    return res.status(statusCode).json({
      status,
      message,
      data,
    });
  };

  res.sendDataCreated = (message, data) => {
    return res.sendJson(201, true, message, data);
  };

  res.sendNotFound = (message, data = null) => {
    return res.sendJson(404, false, message, data);
  };

  res.sendBadRequest = (message, data = null) => {
    return res.sendJson(400, false, message, data);
  };

  res.sendServerError = (message, data = null) => {
    return res.sendJson(500, false, message, data);
  };

  next();
};
