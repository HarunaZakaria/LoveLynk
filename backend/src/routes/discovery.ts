import express from 'express';
import { getStack, swipe, getLikes, getPassed } from '../controllers/discoveryController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/stack', getStack);
router.post('/swipe', swipe);
router.get('/likes', getLikes);
router.get('/passed', getPassed);

export default router;

