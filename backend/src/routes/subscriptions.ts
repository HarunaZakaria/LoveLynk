import express from 'express';
import {
  getPlans,
  createCheckout,
  handleWebhook,
  getStatus,
  cancelSubscription,
} from '../controllers/subscriptionController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/plans', getPlans);
router.post('/checkout', createCheckout);
router.post('/webhook', handleWebhook);
router.get('/status', getStatus);
router.put('/cancel', cancelSubscription);

export default router;

