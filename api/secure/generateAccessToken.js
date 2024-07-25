const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(employee_id) {
  try {
    return jwt.sign({ employee_id }, process.env.SECRET_KEY, {
      expiresIn: "8h",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}

module.exports = generateAccessToken;
