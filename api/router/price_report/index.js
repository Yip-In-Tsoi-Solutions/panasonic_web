const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const price_report = express();
price_report.use(express.json());
// get data filter
const priceReportData = `
SELECT [ID]
      ,[VENDOR_NAME]
      ,[INVOICE_NUM]
      ,CONVERT(varchar, [INVOICE_DATE], 23) as INVOICE_DATE
      ,[PO_NUMBER]
      ,[RELEASE_NUM]
      ,[ITEM]
      ,[DESCRIPTION]
      ,[UOM]
      ,[PO_QTY]
      ,[INV_QTY]
      ,[PO_UNIT_PRICE]
      ,[INV_UNIT_PRICE]
      ,[INV_CURRENCY_CODE]
      ,[DIFF]
      ,[DIFF_AMOUNT]
      ,[DIFF_AMOUNT_THB]
      ,[BUYER]
      ,CONVERT(varchar, [EXCHANGE_RATE], 23) as EXCHANGE_RATE
      ,CONVERT(varchar, [EXCHANGE_DATE], 23) as EXCHANGE_DATE
      ,[REMARK]
  FROM [dbo].[v_PECTH_SUPPLIER_PRICEDIFF]
`
price_report.post("/price_report", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
      ${priceReportData}
      WHERE ${req.body.queryString} ORDER BY id, remark asc
    `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    res.status(500).send(error);
  }
});
// get all data, after filter
price_report.post(
  "/price_report/latest_data",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `
          ${priceReportData}
          WHERE ${req.body.between_date} ORDER BY id, remark asc
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      // Log error for debugging
      console.error("Error retrieving price report data:", error);

      // Send internal server error response
      res.status(500).send("Internal Server Error");
    }
  }
);
price_report.put(
  "/price_report/:id/:po_release",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.id;
      const po_release = req.params.po_release;
      const sql = await sql_serverConn();
      const request = sql.request();
      request.input("id", id);
      request.input("invoice_date", req.body.invoice_date);
      request.input("invoice_num", req.body.invoice_num);
      request.input("po_release", po_release);
      request.input("remark", req.body.remark);
      request.query(
        `
      UPDATE
        dbo.[PECTH_SUPPLIER_PRICEDIFF_HISTORICAL]
      SET
        [REMARK] = @remark, SAVED_Remark_DATE = SYSDATETIME()
      WHERE
        ID = @id AND INVOICE_NUM = @invoice_num AND RELEASE_NUM = @po_release
      `
      );
      res.status(200).send("Data is Updated");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
module.exports = price_report;
