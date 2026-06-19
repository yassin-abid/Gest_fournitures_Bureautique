import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { authenticate, AuthRequest } from '@middleware/auth';
import { validate } from '@middleware/validate';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema,
} from './auth.schema';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateProfile(req.user!.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.changePassword(
      req.user!.userId,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    await authService.logout(token);
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh(req.body.token);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
