import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";

const reason_update = express();

reason_update.use(express.json());

//load data from supplier to Buyer reason
reason_update.post("/load_data_buyer_reason", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    for (const item of req.body) {
      const request = sql.request();
      request.query`
            INSERT INTO PECTH_SUPPLIER_DELIVERY_HISTORICAL (
                [Item No], [Item Name], UOM, [Transaction], Buyer, [PO No], [PO release],
                Vendor, [PO QTY], [Received QTY], [Need By Date], [Promise Date], [Receive Date],
                [Diff Day], [Days More], [Before 3 Days], [Before 2 Days], [Before 1 Day],
                [On Time], [Delay 1 Day], [Delay 2 Days], [Delay 3 Days], [Delay 3 ], Status, T_ID
            ) VALUES (
                @item_no, @item_name, @uom, @transaction, @buyer, @po_no, @po_release,
                @vendor, @po_qty, @received_qty, @need_by_date, @promise_date, @received_date,
                @diff_day, @days_more, @before_3_days, @before_2_days, @before_1_days,
                @on_time, @delay_1_day, @delay_2_days, @delay_3_days, @delay_3_days_more,
                @status, @t_id
            )`;

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
  // const result = await sql.query(
  //   `
  //   SELECT
  //     [Promise Date] as promise_date,
  //     Vendor,
  //     [Item No] as item_no,
  //     [Item Name] as item_name,
  //     [PO No] as po_no,
  //     [PO release] as po_release,
  //     UOM,
  //     [PO QTY] as QTY,
  //     Buyer,
  //     [Diff Day],
  //     reason
  //   FROM
  //     demo.dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
  //   WHERE [Diff Day] != 0 AND reason IS NULL
  //   `
  // );
  const result = await sql.query(
    `
    SELECT
      [Promise Date] as promise_date,
      Vendor,
      [Item No] as item_no,
      [Item Name] as item_name,
      [Diff Day],
      reason
    FROM
      demo.dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
    WHERE [Diff Day] != 0 AND reason IS NULL
    `
  );
  res.status(200).json(result.recordset);
});
// Mocking API for root_cause
reason_update.get("/root_cause", async (req, res) => {
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
export default reason_update;
