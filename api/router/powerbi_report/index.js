const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const power_bi_report = express();
// get all dashboard
power_bi_report.get("/powerbi_dashboard", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query("SELECT * FROM dbo.[POWER_BI_REPORT_LIST]");
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
// add PowerBi dashboard to DB
power_bi_report.post("/powerbi_connect", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    request.input("report_name", req.body.reportName);
    request.input("report_url", req.body.url);
    request.query(
      "INSERT INTO dbo.[POWER_BI_REPORT_LIST] (REPORT_NAME, REPORT_URL) VALUES(@report_name, @report_url)"
    );
    res.status(200).send("Power Bi is connected");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// remove PowerBi Report
power_bi_report.delete("/powerbi_dashboard/:id/:url", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    request.input("report_id", req.params.id);
    request.input("unlink_report_url", atob(req.params.url));
    request.query(
      "DELETE FROM [dbo].[POWER_BI_REPORT_LIST] WHERE [REPORT_ID] = @report_id AND [REPORT_URL] = @unlink_report_url"
    );
    res.status(200).send("Power Bi is disconnected");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = power_bi_report;
