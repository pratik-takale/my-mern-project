const express = require("express");
const { getAdminDashboard } = require("../../controllers/shop/order-controller");
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.get("/dashboard", getAdminDashboard);

module.exports = router;
