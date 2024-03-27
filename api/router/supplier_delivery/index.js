import express from 'express';
const supplier_api = express();

supplier_api.get("/test", (req, res) => {
  res.status(200).send({
    title: 'hello'
  })
});
supplier_api.post("/route2", (req, res) => {

});
supplier_api.put("/route2", (req, res) => {

});
supplier_api.delete("/route2", (req, res) => {

});

// Export the router
export default supplier_api
