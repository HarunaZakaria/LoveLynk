import express from 'express';
import {
  getMe,
  updateMe,
  getUser,
  uploadPhoto,
  deletePhoto,
  uploadVoiceIntro,
  uploadVideoPrompt,
  updatePreferences,
  updateSettings,
  getUserStats,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/:id', getUser);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.delete('/photos/:photoId', deletePhoto);
router.post('/voice-intro', upload.single('audio'), uploadVoiceIntro);
router.post('/video-prompt', upload.single('video'), uploadVideoPrompt);
router.put('/preferences', updatePreferences);
router.put('/settings', updateSettings);
router.get('/stats', getUserStats);

export default router;

