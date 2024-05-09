const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const supplier_api = require("./router/supplier_delivery");
const reason_update = require("./router/reason_update");
const power_bi_report = require("./router/powerbi_report");
const evaluate_form = require("./router/evaluate_form");
const original_delivery_api = require("./router/original_delivery");
const price_report = require("./router/price_report");
app.use(cors({
  methods: ['*'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", original_delivery_api);
app.use("/api", supplier_api);
app.use("/api", reason_update);
app.use("/api", power_bi_report);
app.use("/api", evaluate_form);
app.use("/api", price_report);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});