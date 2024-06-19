const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const price_report = express();
price_report.use(express.json());
// get all data from db
price_report.post(
  "/price_report/latest_data",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `
          SELECT 
            *
          FROM [dbo].[v_PECTH_SUPPLIER_PRICEDIFF]
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
price_report.post("/price_report", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
      SELECT 
        *
      FROM [dbo].[v_PECTH_SUPPLIER_PRICEDIFF]
      WHERE ${req.body.queryString} ORDER BY id, remark asc
    `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    res.status(500).send(error);
  }
});
price_report.put(
  "/price_report/:id/:item_no/:po_release",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.id;
      const item_no = req.params.item_no;
      const po_release = req.params.po_release;
      const sql = await sql_serverConn();
      const request = sql.request();
      request.input("id", id);
      request.input("item_no", item_no);
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
        ID = @id AND ITEM = @item_no AND INVOICE_NUM = @invoice_num AND RELEASE_NUM = @po_release
      `
      );
      res.status(200).send("Data is Updated");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
module.exports = price_report;
