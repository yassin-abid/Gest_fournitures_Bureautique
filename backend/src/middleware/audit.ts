import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { prisma } from '../config/database';

const fetchEntity = async (entityType: string, id: number) => {
  switch (entityType) {
    case 'User': return await prisma.user.findUnique({ where: { id }, include: { service: true, role: true } });
    case 'Order': return await prisma.order.findUnique({ where: { id }, include: { supplier: true } });
    case 'SupplyRequest': return await prisma.supplyRequest.findUnique({ where: { id }, include: { service: true } });
    case 'Role': return await prisma.role.findUnique({ where: { id } });
    case 'Category': return await prisma.category.findUnique({ where: { id } });
    case 'Article': return await prisma.article.findUnique({ where: { id }, include: { category: true } });
    case 'Supplier': return await prisma.supplier.findUnique({ where: { id } });
  }
  return null;
};

export const audit = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let oldValues: any = null;

    if (req.params.id && (action === 'update' || action === 'delete' || req.method === 'PUT' || req.method === 'PATCH')) {
      const id = Number(req.params.id);
      if (!isNaN(id)) {
        try {
          oldValues = await fetchEntity(entityType, id);
          if (oldValues && oldValues.password) delete oldValues.password;
          if (oldValues && oldValues.passwordHash) delete oldValues.passwordHash;
        } catch (err) {
          console.error('[AUDIT] Error fetching old values', err);
        }
      }
    }

    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      // Log after response
      if (req.user && res.statusCode < 400) {
        const entityIdStr =
          req.params.id ||
          (body && body.id) ? String(req.params.id || (body && body.id)) : 'unknown';

        // Async logging to avoid blocking response
        (async () => {
          try {
            let newValues: any = req.method !== 'DELETE' ? { ...req.body } : null;
            
            // Re-fetch the updated entity from DB to have perfectly matching keys for diff!
            if (req.params.id && (action === 'update' || req.method === 'PUT' || req.method === 'PATCH')) {
              const id = Number(req.params.id);
              if (!isNaN(id)) {
                const updatedEntity = await fetchEntity(entityType, id);
                if (updatedEntity) {
                  newValues = updatedEntity;
                }
              }
            }

            if (newValues && newValues.password) delete newValues.password;
            if (newValues && newValues.passwordHash) delete newValues.passwordHash;

            await prisma.auditLog.create({
              data: {
                userId: req.user!.userId,
                action,
                details: JSON.stringify({ entity: entityType, entityId: entityIdStr, oldValues, newValues }),
                ipAddress: req.ip || req.socket?.remoteAddress,
              },
            });
          } catch (err) {
            console.error('[AUDIT ERROR]', err);
          }
        })();
      }
      return originalJson(body);
    };

    next();
  };
};
