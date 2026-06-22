import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { getPrismaSkip, buildPaginatedResult } from '../../utils/pagination';

export const stockService = {
  // ─── Status ───────────────────────────────────────────────

  async getStatus(page: number, limit: number, search = '') {
    const where: any = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.article.count({ where }),
    ]);

    const formatted = data.map((a) => {
      let status = 'normal';
      const qty = a.quantity || 0;
      if (qty === 0) status = 'critical';
      else if (qty <= (a.minStock || 0)) status = 'low';
      else if (qty >= (a.maxStock || Infinity)) status = 'excess';

      return {
        id: a.id,
        articleId: a.id,
        code: a.code,
        name: a.name,
        currentStock: qty,
        minStock: a.minStock,
        maxStock: a.maxStock,
        unit: a.unit,
        status,
        updatedAt: new Date().toISOString(), // Articles don't have update date in French DB
      };
    });

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getStatusByArticle(articleId: number) {
    const a = await prisma.article.findUnique({ where: { id: articleId } });
    if (!a) throw new AppError('Article introuvable', 404);

    let status = 'normal';
    const qty = a.quantity || 0;
    if (qty === 0) status = 'critical';
    else if (qty <= (a.minStock || 0)) status = 'low';
    else if (qty >= (a.maxStock || Infinity)) status = 'excess';

    return {
      id: a.id,
      articleId: a.id,
      code: a.code,
      name: a.name,
      currentStock: qty,
      minStock: a.minStock,
      maxStock: a.maxStock,
      unit: a.unit,
      status,
      updatedAt: new Date().toISOString(),
    };
  },

  // ─── Movements ────────────────────────────────────────────

  async getMovements(page: number, limit: number, articleId?: number) {
    const where: any = {};
    if (articleId) where.articleId = articleId;

    const [data, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { article: true, user: true },
        orderBy: { date: 'desc' },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    const formatted = data.map((m) => ({
      ...m,
      movementType: m.type === 'entrée' ? 'in' : m.type === 'sortie' ? 'out' : 'adjustment',
      articleName: m.article.name,
      userName: `${m.user.firstName} ${m.user.lastName}`,
      createdAt: m.date?.toISOString() || new Date().toISOString(),
    }));

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async createMovement(data: any, userId: number) {
    const article = await prisma.article.findUnique({ where: { id: data.articleId } });
    if (!article) throw new AppError('Article introuvable', 404);

    const type = data.movementType === 'in' ? 'entrée' : data.movementType === 'out' ? 'sortie' : 'ajustement';
    
    const previousStock = article.quantity || 0;
    const increment = data.movementType === 'in' || (data.movementType === 'adjustment' && data.quantity > 0)
      ? Math.abs(data.quantity)
      : -Math.abs(data.quantity);
    
    const newStock = previousStock + increment;

    const m = await prisma.stockMovement.create({
      data: {
        articleId: data.articleId,
        type,
        quantity: Math.abs(data.quantity),
        previousStock,
        newStock,
        reference: data.reference,
        reason: data.reason,
        userId,
      },
      include: { article: true, user: true },
    });

    await prisma.article.update({
      where: { id: data.articleId },
      data: { quantity: newStock },
    });

    return {
      ...m,
      movementType: data.movementType,
      articleName: m.article.name,
      userName: `${m.user.firstName} ${m.user.lastName}`,
      createdAt: m.date?.toISOString() || new Date().toISOString(),
    };
  },

  // ─── Alerts ───────────────────────────────────────────────

  async getAlerts(page: number, limit: number, status = 'active') {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.stockAlert.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { article: true },
        orderBy: { dateAlerte: 'desc' },
      }),
      prisma.stockAlert.count({ where }),
    ]);

    const formatted = data.map((a) => ({
      ...a,
      articleName: a.article.name,
      createdAt: a.dateAlerte?.toISOString() || new Date().toISOString(),
      resolvedAt: a.status === 'résolue' ? new Date().toISOString() : null, // Since we don't have resolvedAt
    }));

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getAlertById(id: number) {
    const a = await prisma.stockAlert.findUnique({
      where: { id },
      include: { article: true },
    });
    if (!a) throw new AppError('Alerte introuvable', 404);

    return {
      ...a,
      articleName: a.article.name,
      createdAt: a.dateAlerte?.toISOString() || new Date().toISOString(),
      resolvedAt: a.status === 'résolue' ? new Date().toISOString() : null,
    };
  },

  async resolveAlert(id: number) {
    const a = await prisma.stockAlert.update({
      where: { id },
      data: { status: 'résolue' },
      include: { article: true },
    });
    return {
      ...a,
      articleName: a.article.name,
      createdAt: a.dateAlerte?.toISOString() || new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
    };
  },

  // ─── Adjustments ──────────────────────────────────────────

  async adjustStock(articleId: number, quantity: number, reason: string, userId: number) {
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) throw new AppError('Article introuvable', 404);

    const diff = quantity - (article.quantity || 0);
    if (diff !== 0) {
      await this.createMovement({
        articleId,
        movementType: 'adjustment',
        quantity: diff,
        reason,
      }, userId);
    }
  },
};
