import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { prisma } from '../config/database';

export const audit = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      // Log after response
      if (req.user && res.statusCode < 400) {
        const entityId =
          req.params.id ||
          (body && body.id) ? String(req.params.id || (body && body.id)) : 'unknown';

        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              details: JSON.stringify({ entity: entityType, entityId, newValues: req.body }),
              ipAddress: req.ip || req.socket?.remoteAddress,
            },
          })
          .catch((err) => console.error('[AUDIT ERROR]', err));
      }
      return originalJson(body);
    };

    next();
  };
};
