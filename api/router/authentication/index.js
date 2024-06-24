const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const bodyParser = require("body-parser");
const generateAccessToken = require("../../secure/generateAccessToken");
const CryptoJS = require("crypto-js");
const authenticateToken = require("../../secure/jwt");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
require("dotenv").config();
const authentication = express();
authentication.use(bodyParser.json());
// Use session middleware
authentication.use(session({
  secret: process.env.SECRET_KEY, // Store your session secret in your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // For production, set secure to true and use HTTPS
}));

// Helper function to update .env file
function updateEnv(key, value) {
  const envFilePath = path.resolve(__dirname, "../../.env");
  const envVars = fs.readFileSync(envFilePath, "utf8").split("\n");

  const targetIndex = envVars.findIndex((line) => line.startsWith(`${key}=`));

  const quotedValue = `"${value}"`; // Add quotes around the value

  if (targetIndex >= 0) {
    envVars[targetIndex] = `${key}=${quotedValue}`;
  } else {
    envVars.push(`${key}=${quotedValue}`);
  }

  fs.writeFileSync(envFilePath, envVars.join("\n"), "utf8");
}

// Generate token key
authentication.post("/auth/user/login", async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).send("Employee ID is required");
    }

    // Encrypt the employee_id
    const encryptedEmployeeId = CryptoJS.AES.encrypt(
      employee_id,
      process.env.SECRET_KEY
    ).toString();

    // Update .env file with the encrypted employee_id (if needed)
    updateEnv("SECRET_KEY", process.env.SECRET_KEY);

    // Generate a token with the encrypted employee_id
    const token = generateAccessToken(encryptedEmployeeId);

    // Store the token in the session
    req.session.token = token;

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Protected route using the authenticateToken middleware
authentication.get("/auth/user/login/getUser", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();

    // Decrypt the employee_id from the token
    const bytes = CryptoJS.AES.decrypt(req.user.employee_id, process.env.SECRET_KEY);
    const decryptedEmployeeId = bytes.toString(CryptoJS.enc.Utf8);

    // Query the database using the decrypted employee_id
    request.input("employeeId", decryptedEmployeeId.toLowerCase());
    const result = await request.query(
      "SELECT CASE WHEN COUNT(*) > 0 THEN 'true' ELSE 'false' END AS [user_status] " +
      "FROM [dbo].[USER_PERMISSION] " +
      "WHERE LOWER([employeeId]) = @employeeId " +
      "GROUP BY [employeeId]"
    );

    res.status(200).send(result.recordset[0]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Logout route
authentication.post("/auth/user/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out. Please try again.");
    } else {
      res.status(200).send("Logout successful.");
    }
  });
});

module.exports = authentication;
