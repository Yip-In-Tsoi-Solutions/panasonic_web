import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";
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
        INV_CURRENCY_CODE as INV_CURRENCY
    FROM
        demo.dbo.MATCHING_INVOICE
    WHERE ${req.body.queryString}
    `
  );
  res.status(200).send(result.recordset);
});
export default price_report;
