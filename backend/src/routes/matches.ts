import express from 'express';
import { getMatches, getMatch, getCompatibility, unmatch } from '../controllers/matchController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getMatches);
router.get('/:id', getMatch);
router.get('/:id/compatibility', getCompatibility);
router.post('/:id/unmatch', unmatch);

export default router;

