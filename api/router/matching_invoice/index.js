const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const matching_invoice = express();
matching_invoice.use(express.json());

// filter of matching_invoice
matching_invoice.post(
  "/matching_invoice",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `
          SELECT
            ID,
            VENDOR_NAME as SUPPLIER,
            PO_NUMBER,
            RELEASE_NUM as PO_RELEASE,
            ITEM as ITEM_CODE,
            DESCRIPTION,
            LINE_NUM,
            CONVERT(varchar, [INVOICE_DATE], 23) as INVOICE_DATE
            BATCH_NAME,
            UOM,
            INVOICE_NUM,
            INV_QTY,
            round(INV_UNIT_PRICE, 2) as UNIT_PRICE,
            INV_CURRENCY_CODE
          FROM
            dbo.[PECTH_SUPPLIER_PRICEDIFF_HISTORICAL]
          WHERE ${req.body.queryString}
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
// insert goods needs to return for creating reuturn PDF
matching_invoice.post(
  "/matching_invoice/createform",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const latestIdResult = await sql.query(`
    SELECT
      CASE 
          WHEN SUBSTRING(RETURN_NO,3,6) = SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(RETURN_NO,3,6),'/',RIGHT('000'+CAST(CONVERT(int,SUBSTRING(RETURN_NO,10,3))+1 as varchar(3)),3)) 
          WHEN SUBSTRING(RETURN_NO,3,6) < SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6),'/001')
          END AS RETURN_NO
    FROM dbo.[RETURN_NO_CONTROL]
    `);
      let returnID = latestIdResult.recordset[0].RETURN_NO;
      for (let i = 0; i < req.body.length; i++) {
        const request = sql.request();
        const {
          supplier,
          po_number,
          po_release,
          item_no,
          description,
          batchName,
          unit,
          inv_qty,
          unitPrice,
          curency,
          invoice_no,
          invoice_date,
          return_qty,
          return_line_no,
          id,
          cause,
        } = req.body[i];
        request.input("return_id", returnID);
        request.input("ID", id);
        request.input("item_no", item_no);
        request.input("description", description);
        request.input("invoice_date", invoice_date);
        request.input("invoice_no", invoice_no);
        request.input("po_number", po_number);
        request.input("po_release", po_release);
        request.input("supplier", supplier);
        request.input("batchName", batchName);
        request.input("unit", unit);
        request.input("inv_qty", inv_qty);
        request.input("unitPrice", unitPrice);
        request.input("currency", curency);
        request.input("return_qty", return_qty);
        request.input("return_amount", return_qty * unitPrice);
        request.input("return_line_no", return_line_no);
        request.input("cause", cause);
        await request.query(
          `
            INSERT INTO dbo.[PECTH_SUPPLIER_RETURN_HISTORICAL]
            (
              [RETURN_DATE],
              [RETURN_DOC_NO],
              [ID],
              [ITEM],
              [DESCRIPTION],
              [INVOICE_DATE],
              [INVOICE_NUM],
              [PO_NUMBER],
              [RELEASE_NUM],
              [VENDOR_NAME],
              [BATCH_NAME],
              [UOM],
              [INV_QTY],
              [INV_UNIT_PRICE],
              [INV_CURRENCY_CODE],
              [RETURN_QTY],
              [RETURN_CAUSE],
              [RETURN_AMOUNT],
              [RETURN_LINE_NO],
              [MODIFIED_DATE],
              [CREATED_DATE]
            ) VALUES
            (
                SYSDATETIME(),
                @return_id,
                @ID,
                @item_no,
                @description,
                @invoice_date,
                @invoice_no,
                @po_number,
                @po_release,
                @supplier,
                @batchName,
                @unit,
                @inv_qty,
                @unitPrice,
                @currency,
                @return_qty,
                @cause,
                @return_amount,
                @return_line_no,
                SYSDATETIME(),
                SYSDATETIME()
            )
          `
        );
      }
      const updateReturnControl = sql.request();
      await updateReturnControl.query(
        `
      UPDATE RETURN_NO_CONTROL SET RETURN_NO = 
      (SELECT
          CASE 
      WHEN SUBSTRING(RETURN_NO,3,6) = SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(RETURN_NO,3,6),'/',RIGHT('000'+CAST(CONVERT(int,SUBSTRING(RETURN_NO,10,3))+1 as varchar(3)),3)) 
      WHEN SUBSTRING(RETURN_NO,3,6) < SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6),'/001')
      END AS RETURN_NO_CHK
      FROM RETURN_NO_CONTROL )
      , MODIFIED_DATE=SYSDATETIME()
      `
      );
      res.status(200).send(returnID);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
// queries all return documents
matching_invoice.get(
  "/matching_invoice/form/docs_no",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = await sql.query(
        `
          SELECT
            CASE 
                WHEN SUBSTRING(RETURN_NO,3,6) = SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(RETURN_NO,3,6),'/',RIGHT('000'+CAST(CONVERT(int,SUBSTRING(RETURN_NO,10,3))+1 as varchar(3)),3)) 
                WHEN SUBSTRING(RETURN_NO,3,6) < SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6) THEN CONCAT('PC',SUBSTRING(CONVERT(varchar, SYSDATETIME(), 112),1,6),'/001')
                END AS RETURN_NO
          FROM dbo.[RETURN_NO_CONTROL]
          `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
// insert to PECTH_SUPPLIER_RETURN_HISTORICAL
matching_invoice.post(
  "/matching_invoice/form",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();
      const { supplier } = req.body;
      request.input("supplier", supplier);
      const query = `
      SELECT
        VENDOR_NAME,
        ITEM,
        DESCRIPTION,
        PO_NUMBER,
        RELEASE_NUM,
        INVOICE_NUM,
        RETURN_QTY,
        UOM,
        ROUND(INV_UNIT_PRICE, 2) AS UNIT_PRICE,
        INV_CURRENCY_CODE,
        CONVERT(varchar, [INVOICE_DATE], 23) as INVOICE_DATE,
        RETURN_CAUSE
      FROM
        dbo.[PECTH_SUPPLIER_RETURN_HISTORICAL]
      WHERE
        [VENDOR_NAME] = @supplier
    `;

      const response = await request.query(query);
      res.status(200).send(response.recordset);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
module.exports = matching_invoice;
