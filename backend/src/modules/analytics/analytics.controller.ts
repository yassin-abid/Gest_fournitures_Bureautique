import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || 'year';
    const data = await analyticsService.getDashboardData(period);
    res.json(data);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données analytiques' });
  }
};
