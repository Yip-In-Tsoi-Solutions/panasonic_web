import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";

const reason_update = express();

reason_update.use(express.json());

reason_update.post("/load_data_buyer_reason", async (req, res) => {
  const sql = await sql_serverConn();
  try {
    for (const item of req.body) {
      await sql.query`INSERT INTO PECTH_SUPPLIER_DELIVERY_HISTORICAL (
            [Item No], [Item Name], UOM, [Transaction], Buyer, [PO No], [PO release], Vendor, [PO QTY], [Received QTY], [Need By Date], [Promise Date], [Receive Date], [Diff Day], [Days More], [Before 3 Days], [Before 2 Days], [Before 1 Day], [On Time], [Delay 1 Day], [Delay 2 Days], [Delay 3 Days], [Delay 3 ], Status, T_ID
          ) VALUES (
            ${item.item_no}, ${item.item_name}, ${item.uom}, ${item.transaction},
            ${item.buyer}, ${item.po_no}, ${item.po_release}, ${item.vendor},
            ${item.po_qty}, ${item.received_qty}, ${item.need_by_date},
            ${item.promise_date}, ${item.received_date}, ${item.diff_day},
            ${item.days_more}, ${item.before_3_days}, ${item.before_2_days},
            ${item.before_1_days}, ${item.on_time}, ${item.delay_1_day},
            ${item.delay_2_days}, ${item.delay_3_days}, ${item.delay_3_days_more},
            ${item.status}, ${item.t_id}
          )`;
    }
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default reason_update;
