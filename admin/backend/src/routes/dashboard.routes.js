const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.use(authAdmin);

router.get("/", dashboardController.getDashboard);

router.get("/sales-chart", dashboardController.getSalesChart);

router.get("/top-products", dashboardController.getTopProducts);

module.exports = router;
