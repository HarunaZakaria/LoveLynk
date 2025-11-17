import express from 'express';
import { submitQuiz, getProfile, getInsights } from '../controllers/personalityController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/quiz', submitQuiz);
router.get('/profile', getProfile);
router.get('/insights', getInsights);

export default router;

