const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const price_report = express();
price_report.use(express.json());
// get all data from db
price_report.post("/price_report", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `
    SELECT
        ITEM,
        REMARKS,
        INVOICE_DATE,
        INVOICE_NUM,
        PO_NUMBER,
        RELEASE_NUM as PO_RELEASE,
        VENDOR_NAME,
        INV_QTY as INVOICE_QTY,
        ROUND(INV_UNIT_PRICE, 2) as INVOICE_UNIT_PRICE,
        INV_QTY * ROUND(INV_UNIT_PRICE, 2) as AMOUNT,
        PO_UNIT_PRICE-INV_UNIT_PRICE as price_diff,
        INV_CURRENCY_CODE as INV_CURRENCY
    FROM
        dbo.PECTH_SUPPLIER_PRICEDIFF_HISTORICAL
    WHERE ${req.body.queryString}
    `
  );
  res.status(200).send(result.recordset);
});
price_report.put("/price_report/:item_no/:po_release", async (req, res) => {
  try {
    const item_no = req.params.item_no;
    const po_release = req.params.po_release;
    const sql = await sql_serverConn();
    const request = sql.request();
    request.query(
      `
      UPDATE
        dbo.PECTH_SUPPLIER_PRICEDIFF_HISTORICAL
      SET
        REMARKS = '${req.body.remark}'
      WHERE
        ITEM = @item_no
        AND INVOICE_DATE = @invoice_date
        AND INVOICE_NUM = @invoice_num
        AND RELEASE_NUM = @po_release
      `
    );
    request.input("item_no", item_no);
    request.input("invoice_date", req.body.invoice_date);
    request.input("invoice_num", req.body.invoice_num);
    request.input("po_release", po_release);
    res.status(200).send("Data is Updated");
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = price_report;
