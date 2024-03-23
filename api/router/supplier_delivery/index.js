import express from 'express';
const supplier_api = express();

// Route 1
supplier_api.get("/test", (req, res) => {
  res.send("Hello world");
});

// Route 2
supplier_api.get("/route2", (req, res) => {
  res.send("This is Route 2");
});

// Export the router
export default supplier_api
