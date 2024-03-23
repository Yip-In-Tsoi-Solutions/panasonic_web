import express from "express";
import ViteExpress from "vite-express";
import supplier_api from "./api/router/supplier_delivery/index.js";
import minify from "express-minify";
import compression from "compression";
const PORT = process.env.PORT || 80;
const app = express();
app.use(compression());
app.use(minify());
// api route configuration
app.use("/api", supplier_api);

// Start express server
ViteExpress.listen(app, PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});