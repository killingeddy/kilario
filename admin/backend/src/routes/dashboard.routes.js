const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// Main dashboard data
router.get('/', dashboardController.getDashboard);

// Sales chart data
router.get('/sales-chart', dashboardController.getSalesChart);

// Top selling products
router.get('/top-products', dashboardController.getTopProducts);

module.exports = router;
