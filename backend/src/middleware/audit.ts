import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { prisma } from '../config/database';

export const audit = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let oldValues: any = null;

    if (req.params.id && (action === 'update' || action === 'delete' || req.method === 'PUT' || req.method === 'PATCH')) {
      const id = Number(req.params.id);
      if (!isNaN(id)) {
        try {
          switch (entityType) {
            case 'User': oldValues = await prisma.user.findUnique({ where: { id } }); break;
            case 'Order': oldValues = await prisma.order.findUnique({ where: { id } }); break;
            case 'SupplyRequest': oldValues = await prisma.supplyRequest.findUnique({ where: { id } }); break;
            case 'Role': oldValues = await prisma.role.findUnique({ where: { id } }); break;
            case 'Category': oldValues = await prisma.category.findUnique({ where: { id } }); break;
            case 'Article': oldValues = await prisma.article.findUnique({ where: { id } }); break;
            case 'Supplier': oldValues = await prisma.supplier.findUnique({ where: { id } }); break;
          }
          if (oldValues && oldValues.password) delete oldValues.password;
        } catch (err) {
          console.error('[AUDIT] Error fetching old values', err);
        }
      }
    }

    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      // Log after response
      if (req.user && res.statusCode < 400) {
        const entityId =
          req.params.id ||
          (body && body.id) ? String(req.params.id || (body && body.id)) : 'unknown';

        const newValues = req.method !== 'DELETE' ? { ...req.body } : null;
        if (newValues && newValues.password) delete newValues.password;

        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              details: JSON.stringify({ entity: entityType, entityId, oldValues, newValues }),
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
