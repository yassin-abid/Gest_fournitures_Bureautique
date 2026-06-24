import { Router } from 'express';
import { aiController } from './ai.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Protect the AI route so only logged-in users can use the chatbot
router.use(authenticate);

router.post('/chat', aiController.chat);

export const aiRouter = router;
