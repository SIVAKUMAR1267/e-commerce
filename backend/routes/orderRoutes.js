import express from 'express';
import { addOrderItems, getCheckoutSessionDetails,getMyOrders, createCheckoutSession,getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/create-checkout-session').post(protect, createCheckoutSession);
router.route('/').get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/checkout-session/:id').get(protect, getCheckoutSessionDetails);
export default router;