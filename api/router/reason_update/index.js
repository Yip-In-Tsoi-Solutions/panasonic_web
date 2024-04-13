import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";

const reason_update = express();

reason_update.use(express.json());

reason_update.post("/load_data_buyer_reason", async (req, res) => {
  const sql = await sql_serverConn();
  try {
    for (const item of req.body) {
      const insertQuery = `
      INSERT INTO dbo.PECTH_SUPPLIER_DELIVERY_HISTORICAL
      ([Item No], [Item Name], UOM, Buyer, [PO No], [PO release], Vendor, QTY, [Promise Date])
      VALUES (@itemNo, @itemName, @UOM, @Buyer, @poNo, @poRelease, @Vendor, @QTY, @promisedDate)
    `;
      const request = sql.request();
      request.input("itemNo", item.item_no);
      request.input("itemName", item.item_name);
      request.input("UOM", item.uom);
      request.input("Buyer", item.buyer);
      request.input("poNo", item.po_no);
      request.input("poRelease", item.po_release);
      request.input("Vendor", item.vendor);
      request.input("QTY", item.po_qty);
      request.input("promisedDate", item.promise_date);
      await request.query(insertQuery);
    }
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});
reason_update.post("/buyer_reason", async (req, res) => {
  const sql = await sql_serverConn();
});

export default reason_update;
