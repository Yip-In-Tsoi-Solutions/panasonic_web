const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(employee_id) {
  return jwt.sign({ employee_id }, process.env.SECRET_KEY, { expiresIn: '60m' });
}

module.exports = generateAccessToken;
