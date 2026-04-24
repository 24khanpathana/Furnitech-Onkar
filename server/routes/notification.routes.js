const express = require('express');
const controller = require('../controllers/notification.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware, requireRole('admin'));
router.get('/', controller.getNotifications);
router.patch('/:id/read', controller.markNotificationRead);

module.exports = router;
