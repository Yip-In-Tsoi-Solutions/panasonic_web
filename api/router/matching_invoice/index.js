const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const matching_invoice = express();
matching_invoice.use(express.json());
// matching_invoice.post("/matching_invoice", async (req, res) => {
//   try {
//     const sql = await sql_serverConn();
//     const result = await sql.query(
//       `
//       SELECT
//         PO_NUMBER,
//         RELEASE_NUM as PO_RELEASE,
//         ITEM as ITEM_CODE,
//         DESCRIPTION,
//         INVOICE_DATE,
//         UOM,
//         INVOICE_NUM,
//         INV_QTY,
//         INV_UNIT_PRICE,
//         INV_CURRENCY_CODE
//       FROM
//         dbo.PECTH_SUPPLIER_RETURN_HISTORICAL
//       WHERE ${req.body.queryString}
//       `
//     );
//     res.status(200).send(result.recordset);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
matching_invoice.post("/matching_invoice", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
      SELECT
        PO_NUMBER,
        RELEASE_NUM as PO_RELEASE,
        ITEM as ITEM_CODE,
        DESCRIPTION,
        UOM,
        INV_UNIT_PRICE,
        INV_CURRENCY_CODE,
        INVOICE_NUM,
        INVOICE_DATE

      FROM
        dbo.PECTH_SUPPLIER_RETURN_HISTORICAL
      WHERE ${req.body.queryString}
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = matching_invoice;
