const express = require('express');
const router = express.Router();
const {
  addNotification,
  getNotificationsByUserId,
  markAsRead,
  clearNotifications
} = require('../controllers/NotificationController');

router.post('/add', addNotification);
router.get('/user/:userId/:numofnotifications', getNotificationsByUserId);
router.put('/mark-read', markAsRead);
router.delete('/clear/:userId', clearNotifications);

module.exports = router;
