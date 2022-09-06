module.exports = (req, res, next) => {
    res.getErrorFirebase = (errorCode) => {
      let message;
      switch (errorCode) {
        case "auth/wrong-password": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/user-not-found": {
          message = "Invalid combination Email address and Password.";
          break;
        }
        case "auth/email-already-in-use": {
          message = "This email already used by another account.";
          break;
        }
        case "auth/argument-error": {
          message = "token failed!";
          break;
        }
        case "auth/user-token-expired": {
          message = "expired!";
          break;
        }
        default:
          message = "Something went wrong.";
      }
  
      return message;
    };
  
    next();
  };