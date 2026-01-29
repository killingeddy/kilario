const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get("/", productController.list);
router.get("/:id", productController.getById);
// SIZES AND CONDITIONS ENDPOINTS
router.get("/sizes/list", productController.getSizes);
router.get("/conditions/list", productController.getConditions);

module.exports = router;
