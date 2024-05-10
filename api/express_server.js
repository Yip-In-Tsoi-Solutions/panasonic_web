const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const supplier_api = require("./router/supplier_delivery");
const reason_update = require("./router/reason_update");
const power_bi_report = require("./router/powerbi_report");
const evaluate_form = require("./router/evaluate_form");
const original_delivery_api = require("./router/original_delivery");
const price_report = require("./router/price_report");
const matching_invoice = require("./router/matching_invoice");
const export_file = require("./router/export_files");
app.use(
  cors({
    methods: ["*"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json({limit: 'Infinity'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/api",
  original_delivery_api,
  supplier_api,
  reason_update,
  power_bi_report,
  evaluate_form,
  price_report,
  matching_invoice,
  export_file
);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
