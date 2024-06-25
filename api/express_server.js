const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
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
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})
app.use(cors(allowedOrigins));
app.use(limiter)
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
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});