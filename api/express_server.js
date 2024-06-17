const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 9000;
const HOST = "0.0.0.0";

const authentication = require("./router/authentication");
const supplier_api = require("./router/supplier_delivery");
const buyer_reason = require("./router/buyer_reason");
const power_bi_report = require("./router/powerbi_report");
const evaluate_form = require("./router/evaluate_form");
const original_delivery_api = require("./router/original_delivery");
const price_report = require("./router/price_report");
const matching_invoice = require("./router/matching_invoice");

const allowedOrigins = ['http://localhost:3000', 'http://localhost:9000'];
app.use(cors({ origin: allowedOrigins }));

app.use(bodyParser.json({ limit: "Infinity" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/api",
  authentication,
  original_delivery_api,
  supplier_api,
  buyer_reason,
  power_bi_report,
  evaluate_form,
  price_report,
  matching_invoice
);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast function to send data to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection event
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // You can process the message and broadcast updates if needed
    broadcast({ message: "Hello from server" });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
