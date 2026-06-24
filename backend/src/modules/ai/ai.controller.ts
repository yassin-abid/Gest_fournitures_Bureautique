import { Request, Response } from 'express';
import { aiService } from './ai.service';
import { analyticsService } from '../analytics/analytics.service';
import { AppError } from '../../middleware/errorHandler';

export class AiController {
  async chat(req: Request, res: Response) {
    try {
      const { message } = req.body;
      if (!message) {
        throw new AppError('Le message est requis', 400);
      }

      // Fetch context data from Analytics Service to provide to Gemini
      // We use 'year' period to provide a good overview of the business
      const contextData = await analyticsService.getDashboardData('year');

      // Call Gemini API
      const reply = await aiService.chatWithData(message, contextData);

      res.status(200).json({
        status: 'success',
        data: {
          reply
        }
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.status).json({ status: 'error', message: error.message });
      } else {
        res.status(500).json({ status: 'error', message: error.message || "Erreur interne de l'IA" });
      }
    }
  }
}

export const aiController = new AiController();
