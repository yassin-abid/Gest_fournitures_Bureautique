import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { authenticate } from '../../middleware/auth';
import { adminOnly } from '../../middleware/roles';
import { audit } from '../../middleware/audit';

const router = Router();

// Protect all admin routes
router.use(authenticate, adminOnly);

// ─── Users ────────────────────────────────────────────────

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const search = req.query.search as string;

    const result = await adminService.getUsers(page, limit, role, search);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getUserById(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/users', audit('create', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.put('/users/:id', audit('update', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateUser(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/users/:id', audit('delete', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

router.delete('/users/:id/hard', audit('delete', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.hardDeleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

router.post('/users/:id/activate', audit('update', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.activateUser(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/users/:id/deactivate', audit('update', 'User'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.deactivateUser(Number(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// ─── Logs ─────────────────────────────────────────────────

router.get('/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const userId = req.query.userId as string;
    const action = req.query.action as string;

    const result = await adminService.getLogs(page, limit, userId ? Number(userId) : undefined, action);
    res.json(result);
  } catch (err) { next(err); }
});

// ─── Settings ─────────────────────────────────────────────

router.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getSettings();
    res.json(result);
  } catch (err) { next(err); }
});

router.put('/settings', audit('update', 'Settings'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateSettings(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
