import express from 'express';
import {
  getChats,
  getChat,
  sendMessage,
  markMessageRead,
  addReaction,
  getConversationStarters,
} from '../controllers/chatController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getChats);
router.get('/:matchId', getChat);
router.post('/:matchId/messages', sendMessage);
router.put('/:matchId/messages/:messageId/read', markMessageRead);
router.post('/:matchId/messages/:messageId/reactions', addReaction);
router.get('/:matchId/starters', getConversationStarters);

export default router;

