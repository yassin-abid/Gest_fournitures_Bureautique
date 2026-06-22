import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { stockService } from './stock.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { audit } from '../../middleware/audit';

const router = Router();

// ─── Status ───────────────────────────────────────────────

router.get('/status', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';

    const result = await stockService.getStatus(page, limit, search);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/status/:articleId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getStatusByArticle(Number(req.params.articleId));
    res.json(result);
  } catch (err) { next(err); }
});

// ─── Movements ────────────────────────────────────────────

router.get('/movements', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const articleId = req.query.articleId ? Number(req.query.articleId) : undefined;

    const result = await stockService.getMovements(page, limit, articleId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/movements', authenticate, audit('create', 'StockMovement'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.createMovement(req.body, req.user!.userId);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// ─── Alerts ───────────────────────────────────────────────

router.get('/alerts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = await stockService.getAlerts(page, limit, status);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/alerts/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getAlertById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.put('/alerts/:id/resolve', authenticate, audit('resolve', 'StockAlert'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.resolveAlert(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// ─── Adjustments ──────────────────────────────────────────

router.post('/adjust', authenticate, audit('adjust', 'Stock'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await stockService.adjustStock(Number(req.body.articleId), req.body.quantity, req.body.reason, req.user!.userId);
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
