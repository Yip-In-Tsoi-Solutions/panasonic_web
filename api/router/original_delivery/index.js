const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const original_delivery_api = express();
const NodeCache = require("node-cache");

//initial variable
const cache = new NodeCache({ stdTTL: 60 });
// display all data from Buyer
original_delivery_api.post(
  "/original_delivery_report/supplier_list_filter_optional",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const query = 
      `
        SELECT [ID]
            ,[PO_NUMBER]
            ,[RELEASE_NUM]
            ,[LINE_NUM]
            ,[SHIPMENT_NUM]
            ,[ITEM_NO]
            ,[ITEM_DES]
            ,[UOM]
            ,[SHIPMENT_AMOUNT]
            ,[QUANTITY]
            ,[QUANTITY_DUE]
            ,[QUANTITY_RECEIVED]
            ,[SUPPLIER]
            ,[CURRENCY_CODE]
            ,[BUYER]
            ,CONVERT(varchar, [NEED_BY_DATE], 23) as NEED_BY_DATE
            ,CONVERT(varchar, [PROMISED_DATE], 23) as PROMISED_DATE
            ,CONVERT(varchar, [RECEIVE_DATE], 23) as RECEIVE_DATE
            ,[TRANSACTION_ID]
            ,CONVERT(varchar, [UPDATE_DATE], 23) as UPDATE_DATE
        FROM [dbo].[tbSupplierDelivery_temp]
        WHERE ${req.body.queryString}
      `;
      // Execute the SQL query
      const result = await sql.query(query);
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of buyer
original_delivery_api.get(
  "/original_delivery_report/dropdown/buyer",
  authenticateToken,
  async (req, res) => {
    try {
      const cacheKey = "buyer";
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.status(200).send(cachedData);
      } else {
        const sql = await sql_serverConn();
        const result = await sql.query(
          `SELECT DISTINCT [Buyer] from dbo.[tbSupplierDelivery_temp] order by Buyer asc`
        );
        cache.set(cacheKey, result.recordset);
        res.status(200).json(result.recordset);
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of vendor
original_delivery_api.get(
  "/original_delivery_report/dropdown/vendor",
  authenticateToken,
  async (req, res) => {
    try {
      const cacheKey = "vendor";
      const cachedData = cache.get(cacheKey); // Get cached data
      if (cachedData) {
        res.status(200).json(cachedData); // Send cached data if available
      } else {
        const sql = await sql_serverConn(); // Connect to SQL Server
        const result = await sql.query(
          `SELECT DISTINCT SUPPLIER FROM dbo.[tbSupplierDelivery_temp] ORDER BY SUPPLIER ASC`
        );
        cache.set(cacheKey, result.recordset); // Cache the result
        res.status(200).send(result.recordset); // Send JSON response with distinct vendors
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display dropdown of Po Number
original_delivery_api.get(
  "/original_delivery_report/dropdown/po_number",
  authenticateToken,
  async (req, res) => {
    try {
      const cacheKey = "po_number";
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.status(200).send(cachedData);
      } else {
        const sql = await sql_serverConn();
        const result = await sql.query(
          `SELECT DISTINCT [PO_NUMBER] from dbo.[tbSupplierDelivery_temp] order by [PO_NUMBER] asc`
        );
        cache.set(cacheKey, result.recordset);
        res.status(200).send(result.recordset);
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = original_delivery_api;
