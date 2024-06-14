const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const buyer_reason = express();
buyer_reason.use(express.json());
//moving data from supplier delivery page to buyer reason page (PECTH_SUPPLIER_DELIVERY_HISTORICAL)
buyer_reason.post("/load_data_buyer_reason", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    for (let i = 0; i < req.body.length; i++) {
      const item = req.body[i];
      const request = sql.request();
      request.input("item_no", item?.ITEM_NO);
      request.input("item_description", item?.ITEM_DESCRIPTION);
      request.input("uom", item?.UOM);
      request.input("buyer", item?.BUYER);
      request.input("po_number", item?.PO_NUMBER);
      request.input("po_release", item?.PO_RELEASE);
      request.input("supplier", item?.SUPPLIER);
      request.input("quantity_po", item?.QUANTITY_PO);
      request.input("quantity_received", item?.QUANTITY_RECEIVED);
      request.input("qty_diff", item?.QTY_DIFF);
      request.input("need_by_date", item?.NEED_BY_DATE);
      request.input("promised_date", item?.PROMISED_DATE);
      request.input("receive_date", item?.RECEIVE_DATE);
      request.input("diff_day", item?.DIFF_DAY);
      request.input("before_3_days_more", item?.BEFORE_3_DAYS_MORE);
      request.input("before_3_days", item?.BEFORE_3_DAYS);
      request.input("before_2_days", item?.BEFORE_2_DAYS);
      request.input("before_1_day", item?.BEFORE_1_DAY);
      request.input("on_time", item?.ON_TIME);
      request.input("delay_1_day", item?.DELAY_1_DAY);
      request.input("delay_2_days", item?.DELAY_2_DAYS);
      request.input("delay_3_days", item?.DELAY_3_DAYS);
      request.input("delay_3_days_more", item?.DELAY_3_DAYS_MORE);
      request.input("status", item?.STATUS);
      request.input("transaction_id", item?.TRANSACTION_ID);

      await request.query(
        `
        INSERT INTO dbo.[PECTH_SUPPLIER_DELIVERY_HISTORICAL] (
          [ITEM_NO],[ITEM_DESCRIPTION],[UOM],[BUYER],[PO_NUMBER],[PO_RELEASE],
          [SUPPLIER],[QUANTITY_PO],[QUANTITY_RECEIVED],[QTY_DIFF],[NEED_BY_DATE],
          [PROMISED_DATE],[RECEIVE_DATE],[DIFF_DAY],[BEFORE_3_DAYS_MORE],
          [BEFORE_3_DAYS],[BEFORE_2_DAYS],[BEFORE_1_DAY],[ON_TIME],[DELAY_1_DAY],
          [DELAY_2_DAYS],[DELAY_3_DAYS],[DELAY_3_DAYS_MORE],[STATUS],[TRANSACTION_ID],
          [VERIFIED_DATE],
          [MODIFIED_DATE],
          [CREATED_DATE]
        )
        VALUES (
          @item_no, @item_description, @uom, @buyer, @po_number, @po_release,
          @supplier, @quantity_po, @quantity_received, @qty_diff, @need_by_date,
          @promised_date, @receive_date, @diff_day, @before_3_days_more,
          @before_3_days, @before_2_days, @before_1_day, @on_time, @delay_1_day,
          @delay_2_days, @delay_3_days, @delay_3_days_more, @status, @transaction_id,
          SYSDATETIME(), SYSDATETIME(), SYSDATETIME()
        )
        `
      );
    }
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// get data from PECTH_SUPPLIER_DELIVERY_HISTORICAL
buyer_reason.get("/buyerlist", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT
      [PROMISED_DATE],
      [RECEIVE_DATE],
      [SUPPLIER],
      [ITEM_NO],
      [ITEM_DESCRIPTION],
      [PO_NUMBER],
      [PO_RELEASE],
      [QUANTITY_PO],
      [QUANTITY_RECEIVED],
      [BUYER]
    FROM
      dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
    WHERE [DIFF_DAY] != 0 AND [REASON_REMARK] IS NULL
    `
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
buyer_reason.post("/buyerlist_filter_optional", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT
      *
    FROM
      dbo.[v_PECTH_SUPPLIER_BUYER_REASON]
    WHERE ${req.body.queryString}
    `
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
buyer_reason.get("/dropdown/root_cause", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT * FROM dbo.[PECTH_ROOT_CAUSE_MASTER]
    `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
buyer_reason.get("/dropdown/actions", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `
    SELECT * FROM dbo.[PECTH_ACTION_MASTER]
    `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
buyer_reason.get("/dropdown/transaction_id", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const result = await sql.query(
      `SELECT DISTINCT TRANSACTION_ID as T_ID from dbo.[PECTH_SUPPLIER_DELIVERY_HISTORICAL] order by TRANSACTION_ID asc`
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// update reason
buyer_reason.put("/buyer/update_reason/:transaction_id", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const transaction_id = req.params.transaction_id;
    const promise_date = req.body.promise_date;
    const receive_date = req.body.receive_date;
    const item_no = req.body.item_no;
    const root_cause = req.body.root_cause;
    const action = req.body.action;
    const delay_cause = req.body.delay_cause;
    const effect_production_shipment = req.body.effect_production_shipment;
    const reason = req.body.reason;
    request.input("transaction_id", transaction_id);
    request.input("promise_date", promise_date);
    request.input("item_no", item_no);
    request.input("receive_date", receive_date);
    request.query(
      `UPDATE dbo.[PECTH_SUPPLIER_DELIVERY_HISTORICAL] SET [REASON_REMARK]='${reason}', [EFFECT_PRODUCTION_SHIPMENT] = '${effect_production_shipment}', [ROOT_CAUSE] = '${root_cause}', [ACTION] = '${action}', [DELAY_CAUSE] = '${delay_cause}', CONFIRM_REASON_DATE = SYSDATETIME()  WHERE [ITEM_NO] = '${item_no}' AND [TRANSACTION_ID] = @transaction_id AND [PROMISED_DATE] = @promise_date`
    );
    res.status(200).send("Data is Updated");
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = buyer_reason;
