import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { ordersService } from './orders.service';
import { authenticate, AuthRequest } from '@middleware/auth';
import { audit } from '@middleware/audit';

const router = Router();

router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = await ordersService.getAll(page, limit, status);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.getById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/', authenticate, audit('create', 'Order'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.create(req.body, req.user!.userId);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, audit('update', 'Order'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/confirm', authenticate, audit('confirm', 'Order'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.confirm(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/ship', authenticate, audit('ship', 'Order'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.ship(Number(req.params.id), req.body.trackingNumber);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/receive', authenticate, audit('receive', 'Order'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.receive(Number(req.params.id), req.body.items, req.user!.userId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/:id/cancel', authenticate, audit('cancel', 'Order'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ordersService.cancel(Number(req.params.id), req.body.reason);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, audit('delete', 'Order'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ordersService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
