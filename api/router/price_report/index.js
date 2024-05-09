const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const price_report = express();
price_report.use(express.json());
// get all data from db
price_report.post("/price_report/data", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `
    SELECT
        ITEM,
        DESCRIPTION,
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
        demo.dbo.MATCHING_INVOICE
    WHERE ${req.body.queryString}
    `
  );
  res.status(200).send(result.recordset);
});
price_report.post("/price_report/matching", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT
      PO_NUMBER,
      RELEASE_NUM as PO_RELEASE,
      ITEM as ITEM_CODE,
      DESCRIPTION,
      INV_CURRENCY_CODE,
      INVOICE_DATE,
      BATCH_NAME,
      UOM,
      INV_QTY,
      INV_UNIT_PRICE
    FROM
      dbo.MATCHING_INVOICE
    WHERE ${req.body.queryString}
    `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = price_report;
