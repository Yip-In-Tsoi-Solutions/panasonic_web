import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";
const original_delivery_api = express();
original_delivery_api.get("/original_delivery_report", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(`SELECT * from dbo.Org_delivery_report`);
    res.status(200).json(result.recordset);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
});
// display all data from Buyer
original_delivery_api.post("/original_delivery_report/supplier_list_filter_optional", async (req, res) => {
  const sql = await sql_serverConn();
  const query = `SELECT * FROM dbo.Org_delivery_report WHERE ${req.body.queryString}`;
  // Execute the SQL query
  const result = await sql.query(query);
  res.status(200).json(result.recordset);
});
// display dropdown of buyer
original_delivery_api.get("/original_delivery_report/dropdown/buyer", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `SELECT DISTINCT [Buyer] from dbo.Org_delivery_report order by Buyer asc`
  );
  res.status(200).json(result.recordset);
});
// display dropdown of vendor
original_delivery_api.get("/original_delivery_report/dropdown/vendor", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `SELECT DISTINCT Vendor from dbo.Org_delivery_report order by Vendor asc`
  );
  res.status(200).json(result.recordset);
});
// display dropdown of Po Number
original_delivery_api.get("/original_delivery_report/dropdown/po_number", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `SELECT DISTINCT [PO No] as po_no from dbo.Org_delivery_report order by [PO No] asc`
  );
  res.status(200).json(result.recordset);
});
// Export the router
export default original_delivery_api;
