const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const supplier_api = express();
// display all Supplier
supplier_api.get("/supplier_list", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(`SELECT * from dbo.[tbSupplierDelivery]`);
    res.status(200).json(result.recordset);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
});
// display all data from Buyer
supplier_api.post("/supplier_list_filter_optional", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT * FROM dbo.v_PECTH_SUPPLIER_DELIVERY_DATEDIFF WHERE ${req.body.queryString} AND (QUANTITY_PO - QUANTITY_RECEIVED <> 0 OR (DATEDIFF(day,RECEIVE_DATE,PROMISED_DATE) <> 0) )
    `
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// display dropdown of buyer
supplier_api.get("/dropdown/buyer", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `SELECT DISTINCT [Buyer] from dbo.[tbSupplierDelivery] order by [Buyer] asc`
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// display dropdown of vendor
supplier_api.get("/dropdown/vendor", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `SELECT DISTINCT [SUPPLIER] from dbo.[tbSupplierDelivery] order by [SUPPLIER] asc`
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// display dropdown of Po Number
supplier_api.get("/dropdown/po_number", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `SELECT DISTINCT [PO_NUMBER] as po_no from dbo.[tbSupplierDelivery] order by [PO_NUMBER] asc`
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Export to csv / excel
supplier_api.post("/supplier_list/export_file", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `SELECT * from dbo.[v_PECTH_SUPPLIER_DELIVERY_DATEDIFF] WHERE ${req.body.queryString}`
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
});
module.exports = supplier_api;
