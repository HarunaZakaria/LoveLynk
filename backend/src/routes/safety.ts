import express from 'express';
import { reportUser, blockUser, getBlockedUsers } from '../controllers/safetyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/report', reportUser);
router.post('/block', blockUser);
router.get('/blocked', getBlockedUsers);

export default router;

