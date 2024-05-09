const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const dfd = require('danfojs-node');
const reason_update = express();
reason_update.use(express.json());
//load data from supplier to Buyer reason
reason_update.post("/load_data_buyer_reason", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    for (const item of req.body) {
      const request = sql.request();
      request.query(
        `INSERT INTO PECTH_SUPPLIER_DELIVERY_HISTORICAL ( [Item No], [Item Name], UOM, [Transaction], Buyer, [PO No], [PO release], Vendor, [PO QTY], [Received QTY], [Need By Date], [Promise Date], [Receive Date], [Diff Day], [Days More], [Before 3 Days], [Before 2 Days], [Before 1 Day], [On Time], [Delay 1 Day], [Delay 2 Days], [Delay 3 Days], [Delay 3 ], Status, T_ID ) VALUES ( @item_no, @item_name, @uom, @transaction, @buyer, @po_no, @po_release, @vendor, @po_qty, @received_qty, @need_by_date, @promise_date, @received_date, @diff_day, @days_more, @before_3_days, @before_2_days, @before_1_days, @on_time, @delay_1_day, @delay_2_days, @delay_3_days, @delay_3_days_more, @status, @t_id)`
      );
      // request.query(
      //   `
      //   BEGIN
      //     IF NOT EXISTS (SELECT [Item No], [Item Name], UOM, [Transaction], Buyer, [PO No], [PO release],
      //                   Vendor, [PO QTY], [Received QTY], [Need By Date], [Promise Date], [Receive Date],
      //                   [Diff Day], [Days More], [Before 3 Days], [Before 2 Days], [Before 1 Day],
      //                   [On Time], [Delay 1 Day], [Delay 2 Days], [Delay 3 Days], [Delay 3 ], Status, T_ID FROM dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL WHERE Buyer = @buyer)
      //     BEGIN
      //         INSERT INTO PECTH_SUPPLIER_DELIVERY_HISTORICAL (
      //                   [Item No], [Item Name], UOM, [Transaction], Buyer, [PO No], [PO release],
      //                   Vendor, [PO QTY], [Received QTY], [Need By Date], [Promise Date], [Receive Date],
      //                   [Diff Day], [Days More], [Before 3 Days], [Before 2 Days], [Before 1 Day],
      //                   [On Time], [Delay 1 Day], [Delay 2 Days], [Delay 3 Days], [Delay 3 ], Status, T_ID
      //               ) VALUES (
      //                   @item_no, @item_name, @uom, @transaction, @buyer, @po_no, @po_release,
      //                   @vendor, @po_qty, @received_qty, @need_by_date, @promise_date, @received_date,
      //                   @diff_day, @days_more, @before_3_days, @before_2_days, @before_1_days,
      //                   @on_time, @delay_1_day, @delay_2_days, @delay_3_days, @delay_3_days_more,
      //                   @status, @t_id
      //               )
      //     END
      //   END
      //   `
      // );

      request.input("item_no", item.item_no);
      request.input("item_name", item.item_name);
      request.input("uom", item.uom);
      request.input("transaction", item.transaction);
      request.input("buyer", item.buyer);
      request.input("po_no", item.po_no);
      request.input("po_release", item.po_release);
      request.input("vendor", item.vendor);
      request.input("po_qty", item.po_qty);
      request.input("received_qty", item.received_qty);
      request.input("need_by_date", item.need_by_date);
      request.input("promise_date", item.promise_date);
      request.input("received_date", item.received_date);
      request.input("diff_day", item.diff_day);
      request.input("days_more", item.days_more);
      request.input("before_3_days", item.before_3_days);
      request.input("before_2_days", item.before_2_days);
      request.input("before_1_days", item.before_1_days);
      request.input("on_time", item.on_time);
      request.input("delay_1_day", item.delay_1_day);
      request.input("delay_2_days", item.delay_2_days);
      request.input("delay_3_days", item.delay_3_days);
      request.input("delay_3_days_more", item.delay_3_days_more);
      request.input("status", item.status);
      request.input("t_id", item.t_id);
    }
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// get data from PECTH_SUPPLIER_DELIVERY_HISTORICAL
reason_update.get("/buyerlist", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `
    SELECT
      [promise date] as promise_date,
      [Receive Date] as receive_date,
      [Vendor],
      [Item No] as item_no, 
      [Item Name] as item_name,
      [po no] as po_number,
      [po release] as po_release,
      [Received QTY] as QTY,
      BUYER
    FROM
      demo.dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
    WHERE [Diff Day] != 0 AND reason IS NULL
    `
  );
  res.status(200).json(result.recordset);
});
reason_update.post("/buyerlist_filter_optional", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `
    SELECT
      BUYER,
      [promise date] as promise_date,
      [Receive Date] as receive_date,
      [Vendor],
      [Item No] as item_no, 
      [Item Name] as item_name,
      [po no] as po_number,
      [po release] as po_release,
      [Received QTY] as QTY,
      T_ID
    FROM
      dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
    WHERE [Diff Day] != 0 AND reason = '' ${req.body.queryString}
    `
  );
  res.status(200).json(result.recordset);
});
// Mocking API for root_cause
reason_update.get("/dropdown/root_cause", async (req, res) => {
  const data = [
    {
      case: "Supplier Does not inform delivery changing",
    },
    {
      case: "Buyer does not update delivery in system",
    },
    {
      case: "Supplier postpone shipment",
    },
  ];
  res.status(200).send(data);
});
reason_update.get("/dropdown/actions", async (req, res) => {
  const data = [
    {
      type: "Supplier must send in advance delivery",
    },
    {
      type: "Buyer must update realtime delivery",
    },
    {
      type: "Countermeasure require",
    },
  ];
  res.status(200).send(data);
});
reason_update.get("/dropdown/transaction_id", async (req, res) => {
  const sql = await sql_serverConn();
  const result = await sql.query(
    `SELECT DISTINCT T_ID from demo.dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL order by T_ID asc`
  );
  res.status(200).json(result.recordset);
});
async function saveFile(df, files_type) {
  if (files_type === "xlsx") {
    dfd.toExcel(df, { filePath: `./storage/dataset/sample.${files_type}` });
  } else if (files_type === "csv") {
    dfd.toCSV(df, { filePath: `./storage/dataset/sample.${files_type}` });
  }
}
reason_update.post("/export/data", async (req, res) => {
  let dataSet = [];
  let files_type = "";
  if (req.body.files_type === "excel") {
    req.body.dataset.forEach((item) => {
      dataSet.push(item);
    });
    files_type += "xlsx";
    const df = new dfd.DataFrame(dataSet);
    saveFile(df, files_type);
  } else if (req.body.files_type === "csv") {
    req.body.dataset.forEach((item) => {
      dataSet.push(item);
    });
    files_type += "csv";
    const df = new dfd.DataFrame(dataSet);
    saveFile(df, files_type);
  }
});
// update reason
reason_update.put("/buyer/update_reason/:transaction_id", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const transaction_id = req.params.transaction_id;
    const promise_date = req.body.promise_date;
    const receive_date = req.body.receive_date;
    const item_no = req.body.item_no;
    const root_cause = req.body.root_cause;
    const action = req.body.action;
    const effect_production_shipment = req.body.effect_production_shipment;
    const reason = req.body.reason;
    request.query(
      `UPDATE dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL SET root_cause = '${root_cause}', action = '${action}', effect_production_shipment = '${effect_production_shipment}', reason='${reason}' WHERE T_ID = @transaction_id AND [Promise Date] = @promise_date AND [Item No] = @item_no AND [Receive Date] = @receive_date`
    );
    request.input("transaction_id", transaction_id);
    request.input("promise_date", promise_date);
    request.input("item_no", item_no);
    request.input("receive_date", receive_date);
    res.status(200).send("Data is Updated");
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = reason_update;
