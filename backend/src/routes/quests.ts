import express from 'express';
import {
  getAvailableQuests,
  createQuest,
  getQuest,
  submitQuestResponse,
  completeQuest,
  getQuestHistory,
} from '../controllers/questController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/available', getAvailableQuests);
router.post('/', createQuest);
router.get('/:id', getQuest);
router.post('/:id/response', submitQuestResponse);
router.put('/:id/complete', completeQuest);
router.get('/history', getQuestHistory);

export default router;

