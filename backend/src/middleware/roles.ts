import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Accès refusé',
        message: `Cette action requiert l'un des rôles suivants : ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

// Convenience aliases
export const adminOnly = requireRoles('admin');
export const stockManager = requireRoles('admin', 'gestionnaire_stock');
export const serviceManager = requireRoles('admin', 'responsable_service');
export const purchasingManager = requireRoles('admin', 'responsable_achats');
export const allStaff = requireRoles(
  'admin',
  'responsable_service',
  'gestionnaire_stock',
  'responsable_achats',
  'employe'
);
