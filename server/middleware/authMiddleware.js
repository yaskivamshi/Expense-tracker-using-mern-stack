
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const tokenValue = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User Authenticated:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
