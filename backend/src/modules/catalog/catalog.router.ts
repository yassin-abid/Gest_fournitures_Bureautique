import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { articleService, categoryService, supplierService } from './catalog.service';
import { authenticate } from '../../middleware/auth';
import { audit } from '../../middleware/audit';

const router = Router();

// ─── Articles ───────────────────────────────────────────────

router.get('/articles', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const status = req.query.status as string;

    const result = await articleService.getAll(page, limit, search, categoryId, status);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/articles/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.getById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/articles', authenticate, audit('create', 'Article'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.create(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/articles/:id', authenticate, audit('update', 'Article'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/articles/:id', authenticate, audit('delete', 'Article'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await articleService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

// ─── Categories ─────────────────────────────────────────────

router.get('/categories', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getAll();
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/categories/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/categories', authenticate, audit('create', 'Category'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.create(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/categories/:id', authenticate, audit('update', 'Category'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/categories/:id', authenticate, audit('delete', 'Category'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

// ─── Suppliers ──────────────────────────────────────────────

router.get('/suppliers', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const result = await supplierService.getAll(page, limit, search);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/suppliers/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await supplierService.getById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/suppliers', authenticate, audit('create', 'Supplier'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await supplierService.create(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/suppliers/:id', authenticate, audit('update', 'Supplier'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await supplierService.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/suppliers/:id', authenticate, audit('delete', 'Supplier'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await supplierService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
