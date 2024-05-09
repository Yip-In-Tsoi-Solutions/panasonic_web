const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");

const power_bi_report = express();
// get all dashboard
power_bi_report.get('/powerbi_dashboard', async (req, res)=> {
    const sql = await sql_serverConn();
    const result = await sql.query("SELECT * FROM dbo.power_bi");
    res.status(200).send(result.recordset);
});
// add PowerBi dashboard to DB
power_bi_report.post("/powerbi_connect", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    request.query(
      "INSERT INTO demo.dbo.power_bi (report_name, report_url) VALUES(@report_name, @report_url)"
    );
    request.input("report_name", req.body.reportName);
    request.input("report_url", req.body.url);
    // res.status(200).send("Power Bi is connected");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

power_bi_report.use(express.json());

module.exports = power_bi_report;
