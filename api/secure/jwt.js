const jwt = require("jsonwebtoken");
require("dotenv").config();
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.redirect('/');
    }
    req.user = user;

    next();
  });
}
module.exports = authenticateToken;