const express = require("express");
const collectionController = require("../controllers/collection.controller");
const authAdmin = require("../middlewares/authAdmin");
const { validate, validateQuery } = require("../middlewares/validate");
const {
  createCollectionSchema,
  updateCollectionSchema,
  collectionQuerySchema,
} = require("../validations/collection.validation");

const router = express.Router();

router.use(authAdmin);
router.get("/active", collectionController.getActive);
router.get(
  "/",
  validateQuery(collectionQuerySchema),
  collectionController.list,
);
router.get("/:id", collectionController.getById);
router.post("/", validate(createCollectionSchema), collectionController.create);
router.put(
  "/:id",
  validate(updateCollectionSchema),
  collectionController.update,
);
router.patch("/:id/toggle", collectionController.toggleActive);
router.delete("/:id", collectionController.delete);

module.exports = router;
