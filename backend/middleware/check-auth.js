const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1]; // Bearer: asdfasdfajaoibv
  const decodedToken = jwt.verify(token, "oddly-particular-secret".repeat(10));
  req.userData = {email: decodedToken.email, userId: decodedToken.userId};
  next();
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated dude!"
    })
  }
};
