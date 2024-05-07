import express from "express";
import ViteExpress from "vite-express";
import minify from "express-minify";
import compression from "compression";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
// api route
import supplier_api from "./api/router/supplier_delivery/index.js";
import reason_update from "./api/router/reason_update/index.js";
import power_bi_report from "./api/router/powerbi_report/index.js";
import evaluate_form from "./api/router/evaluate_form/index.js";
import original_delivery_api from "./api/router/original_delivery/index.js";
import price_report from "./api/router/price_report/index.js";
// import condb from "./api/router/condb.js";
const PORT = process.env.PORT || 80;
const app = express();
// config API Rules  
app.use(bodyParser.json());
app.use(compression());
app.use(minify());
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  message: "Too many request",
});
app.use(limiter);
// config CROSS ORIGIN
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With"
  );
  next();
});
// API Route
app.use("/api", original_delivery_api);
app.use("/api", supplier_api);
app.use("/api", reason_update);
app.use("/api", power_bi_report);
app.use("/api", evaluate_form);
app.use("/api", price_report);
// app.use(condb);

// Start express server
ViteExpress.listen(app, PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
