const express = require("express");
const notificationController = require("../controllers/notification.controller");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.use(authAdmin);

router.get("/unread-count", notificationController.getUnreadCount);
router.get("/", notificationController.list);
router.post("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
