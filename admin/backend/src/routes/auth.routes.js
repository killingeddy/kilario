const express = require("express");
const authController = require("../controllers/auth.controller");
const authAdmin = require("../middlewares/authAdmin");
const { validate } = require("../middlewares/validate");
const {
  loginSchema,
  registerAdminSchema,
  changePasswordSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/register",
  validate(registerAdminSchema),
  authController.register,
);
router.get("/me", authAdmin, authController.me);
router.post(
  "/change-password",
  authAdmin,
  validate(changePasswordSchema),
  authController.changePassword,
);

module.exports = router;
