import { Router } from 'express';
import { getDashboardData } from './analytics.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/roles';

const router = Router();

// Only admin and purchase managers should access analytics
router.get('/dashboard', authenticate, requireRoles('Administrateur', 'Responsable Achats'), getDashboardData);

export default router;
