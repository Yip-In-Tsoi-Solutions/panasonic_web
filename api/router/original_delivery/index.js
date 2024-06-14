const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const original_delivery_api = express();
// original_delivery_api.get("/original_delivery_report", authenticateToken, async (req, res) => {
//   try {
//     const sql = await sql_serverConn();
//     const result = await sql.query(`SELECT * from dbo.[tbSupplierDelivery]`);
//     res.status(200).json(result.recordset);
//   } catch (error) {
//     if (error) {
//       res.status(500).json({ message: error });
//     }
//   }
// });
// display all data from Buyer
original_delivery_api.post(
  "/original_delivery_report/supplier_list_filter_optional",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const query = `SELECT * FROM dbo.[tbSupplierDelivery] WHERE ${req.body.queryString}`;
      // Execute the SQL query
      const result = await sql.query(query);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of buyer
original_delivery_api.get(
  "/original_delivery_report/dropdown/buyer",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `SELECT DISTINCT [Buyer] from dbo.[tbSupplierDelivery] order by Buyer asc`
      );
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of vendor
original_delivery_api.get(
  "/original_delivery_report/dropdown/vendor",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `SELECT DISTINCT SUPPLIER from dbo.[tbSupplierDelivery] order by SUPPLIER asc`
      );
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of Po Number
original_delivery_api.get(
  "/original_delivery_report/dropdown/po_number",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `SELECT DISTINCT [PO_NUMBER] from dbo.[tbSupplierDelivery] order by [PO_NUMBER] asc`
      );
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = original_delivery_api;
