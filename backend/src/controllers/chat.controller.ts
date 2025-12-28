import { Request, Response } from 'express';
import chatService from '../services/chat.service';

export class ChatController {
    /**
     * Process chat message
     */
    async chat(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId, message, sessionId } = req.body;

            // Validation
            if (!chatbotId || !message) {
                res.status(400).json({
                    error: 'Missing required fields',
                    required: ['chatbotId', 'message'],
                });
                return;
            }

            // Use existing session or create new one
            const session = sessionId || chatService.createSession();

            const response = await chatService.processMessage({
                chatbotId,
                sessionId: session,
                message,
            });

            if (response.error === 'LIMIT_EXCEEDED') {
                res.status(402).json({
                    success: false,
                    error: 'LIMIT_EXCEEDED',
                    message: response.response,
                    sessionId: response.sessionId,
                });
                return;
            }

            if (response.error === 'NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Chatbot not found',
                });
                return;
            }

            res.json({
                success: true,
                response: response.response,
                sessionId: response.sessionId,
            });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({
                success: false,
                error: 'INTERNAL_ERROR',
                message: 'Failed to process message',
            });
        }
    }

    /**
     * Get chat history
     */
    async getChatHistory(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;
            const limit = parseInt(req.query.limit as string) || 50;

            const history = await chatService.getChatbotHistory(chatbotId, limit);

            res.json({
                success: true,
                history,
            });
        } catch (error) {
            console.error('Get chat history error:', error);
            res.status(500).json({ error: 'Failed to get chat history' });
        }
    }

    /**
     * Create new session
     */
    async createSession(req: Request, res: Response): Promise<void> {
        try {
            const sessionId = chatService.createSession();
            res.json({
                success: true,
                sessionId,
            });
        } catch (error) {
            console.error('Create session error:', error);
            res.status(500).json({ error: 'Failed to create session' });
        }
    }
}

export default new ChatController();
