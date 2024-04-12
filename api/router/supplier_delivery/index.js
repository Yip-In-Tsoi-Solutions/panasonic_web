import express from "express";
const supplier_api = express();
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";

supplier_api.get("/supplier_list", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(`SELECT * from dbo.Org_delivery_report`);
  res.status(200).json(result.recordset);
});
supplier_api.get("/dropdown/buyer", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(`SELECT DISTINCT [Buyer] from dbo.Org_delivery_report order by Buyer asc`);
  res.status(200).json(result.recordset);
});
supplier_api.get("/dropdown/vendor", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(`SELECT DISTINCT Vendor from dbo.Org_delivery_report order by Vendor asc`);
  res.status(200).json(result.recordset);
});
supplier_api.get("/dropdown/po_number", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `SELECT DISTINCT [PO No] as po_no from dbo.Org_delivery_report order by [PO No] asc`
  );
  res.status(200).json(result.recordset);
});
// Export the router
export default supplier_api;
