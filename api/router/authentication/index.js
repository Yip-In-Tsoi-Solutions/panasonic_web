const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const CryptoJS = require("crypto-js");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const fs = require("fs");
const path = require("path");
const generateAccessToken = require("../../secure/generateAccessToken");
require("dotenv").config();
const authenticateToken = require("../../secure/jwt");
const authentication = express();
authentication.use(bodyParser.json());

// Setup Passport.js JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Decrypt the employee_id from JWT payload
      const bytes = CryptoJS.AES.decrypt(
        jwtPayload.employee_id,
        process.env.SECRET_KEY
      );
      const decryptedEmployeeId = bytes.toString(CryptoJS.enc.Utf8);

      // Check database for user based on decrypted employee_id
      const sql = await sql_serverConn();
      const request = sql.request();
      request.input("employeeId", decryptedEmployeeId.toLowerCase());
      const result = await request.query(`
        SELECT CASE WHEN COUNT(*) > 0 THEN 'true' ELSE 'false' END AS [user_status]
        FROM [dbo].[v_PECTH_USER_PERMISSION]
        WHERE LOWER([employeeId]) = @employeeId
        GROUP BY [employeeId]
      `);

      if (result.recordset.length > 0) {
        return done(null, { employee_id: decryptedEmployeeId });
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Login route
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

    // Generate JWT token
    const token = generateAccessToken(
      { employee_id: encryptedEmployeeId },
      process.env.SECRET_KEY
    );

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Protected route
authentication.get(
  "/auth/user/login/getUser",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();

      // Decrypt the employee_id from the token
      if (req.user.employee_id != "") {
        const bytes = CryptoJS.AES.decrypt(
          req.user.employee_id.employee_id,
          process.env.SECRET_KEY
        );
        const decryptedEmployeeId = bytes.toString(CryptoJS.enc.Utf8);
        // Query the database using the decrypted employee_id
        request.input("employeeId", decryptedEmployeeId.toLowerCase());
        const result = await request.query(
          `
          SELECT CASE WHEN COUNT(*) > 0 THEN 'true' ELSE 'false' END AS [user_status] FROM [dbo].[v_PECTH_USER_PERMISSION] 
          WHERE LOWER([employeeId]) = @employeeId
          GROUP BY [employeeId]
        `
        );
        res.status(200).send(result.recordset[0]);
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Logout route
authentication.post("/auth/user/logout", (req, res) => {
  // Implement logout functionality as needed
  res.status(200).send("Logout successful.");
});

module.exports = authentication;
