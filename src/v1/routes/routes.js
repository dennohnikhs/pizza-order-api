const express = require("express");
const { PlaceOrder, listOrders } = require("../../controllers/controllers");
const { executeQuery } = require("../../db/connection");
const router = express.Router();

// router.get("/test", async (req, res) => {
//   res.json({ name: "This is a test" });
// });

router.post("/place-order", PlaceOrder);
router.get("/list-orders", listOrders);

module.exports = router;
