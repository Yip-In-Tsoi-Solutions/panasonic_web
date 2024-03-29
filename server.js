import express from "express";
import ViteExpress from "vite-express";
import supplier_api from "./api/router/supplier_delivery/index.js";
import minify from "express-minify";
import compression from "compression";
import condb from "./api/router/condb.js";
const PORT = process.env.PORT || 80;
const app = express();
app.use(compression());
app.use(minify());
// api route configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use("/api", supplier_api);
app.use(condb);

// Start express server
ViteExpress.listen(app, PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
