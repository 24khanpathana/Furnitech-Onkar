const express = require('express');
const controller = require('../controllers/order.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard/summary', controller.getDashboardSummary);
router.get('/recent', controller.getRecentOrders);
router.get('/export/csv', requireRole('admin'), controller.downloadOrdersCsv);
router.get('/deleted', requireRole('admin'), controller.getDeletedOrders);
router.post('/', requireRole('admin', 'worker'), controller.createOrder);
router.get('/', requireRole('admin', 'worker'), controller.getOrders);
router.get('/:orderId', requireRole('admin', 'worker'), controller.getOrderByOrderId);
router.put('/:id/status', requireRole('admin'), controller.updateOrderStatus);
router.delete('/:id', requireRole('admin'), controller.deleteOrder);

module.exports = router;
