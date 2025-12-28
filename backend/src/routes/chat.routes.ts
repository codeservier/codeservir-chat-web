import { Router } from 'express';
import chatController from '../controllers/chat.controller';

const router = Router();

// Process chat message
router.post('/', (req, res) => chatController.chat(req, res));

// Create new session
router.post('/session', (req, res) => chatController.createSession(req, res));

// Get chat history
router.get('/:chatbotId/history', (req, res) => chatController.getChatHistory(req, res));

export default router;
