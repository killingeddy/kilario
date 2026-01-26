const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// List notifications
router.get('/', notificationController.list);

// Mark all as read
router.post('/read-all', notificationController.markAllAsRead);

// Mark single notification as read
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
