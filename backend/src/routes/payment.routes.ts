import { Router } from 'express';
import paymentController from '../controllers/payment.controller';

const router = Router();

// Get available plans
router.get('/plans', (req, res) => paymentController.getPlans(req, res));

// Create payment order
router.post('/create-order', (req, res) => paymentController.createOrder(req, res));

// Verify payment
router.post('/verify', (req, res) => paymentController.verifyPayment(req, res));

// Get subscription details
router.get('/subscription/:chatbotId', (req, res) => paymentController.getSubscription(req, res));

// Get payment history
router.get('/history/:chatbotId', (req, res) => paymentController.getPaymentHistory(req, res));

export default router;
