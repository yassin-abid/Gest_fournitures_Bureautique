import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { reportsService } from './reports.service';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };
    const result = await reportsService.getSummary(startDate, endDate);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };
    const result = await reportsService.getRequestsAnalytics(startDate, endDate);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/stock', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reportsService.getStockAnalytics();
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
