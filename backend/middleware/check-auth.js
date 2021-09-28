const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1]; // Bearer: asdfasdfajaoibv
  jwt.verify(token, "oddly-particular-secret".repeat(10));
  next();
  } catch (error) {
    res.status(401).json({
      message: "Auth Failed!"
    })
  }
};
