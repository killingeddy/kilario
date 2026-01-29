const express = require("express");
const collectionController = require("../controllers/collection.controller");

const router = express.Router();

router.get("/active", collectionController.getActive);
router.get("/", collectionController.list);
router.get("/:id", collectionController.getById);

module.exports = router;
