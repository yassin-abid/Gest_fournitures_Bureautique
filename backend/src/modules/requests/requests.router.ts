import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { requestsService } from './requests.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { audit } from '../../middleware/audit';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = await requestsService.getAll(page, limit, status, req.user!.userId, req.user!.role);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.getById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/', authenticate, audit('create', 'SupplyRequest'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, audit('update', 'SupplyRequest'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/submit', authenticate, audit('submit', 'SupplyRequest'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.submit(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/approve', authenticate, audit('approve', 'SupplyRequest'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.approve(Number(req.params.id), req.user!.userId, req.body.notes);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/reject', authenticate, audit('reject', 'SupplyRequest'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.reject(Number(req.params.id), req.user!.userId, req.body.reason);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/cancel', authenticate, audit('cancel', 'SupplyRequest'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestsService.cancel(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, audit('delete', 'SupplyRequest'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestsService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
