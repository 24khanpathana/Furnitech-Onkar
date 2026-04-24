const express = require('express');
const controller = require('../controllers/auth.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup-worker', controller.signupWorker);
router.post('/login-worker', controller.loginWorker);
router.post('/login-admin', controller.loginAdmin);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.get('/me', authMiddleware, controller.getProfile);
router.get('/pending-workers', authMiddleware, requireRole('admin'), controller.getPendingWorkers);
router.patch('/workers/:id/review', authMiddleware, requireRole('admin'), controller.reviewWorker);

module.exports = router;
