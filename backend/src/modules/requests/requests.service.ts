import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { getPrismaSkip, buildPaginatedResult } from '../../utils/pagination';

export const requestsService = {
  async getAll(page: number, limit: number, status?: string, userId?: number, role?: string) {
    const where: any = {};
    if (status) where.status = status;

    // RBAC logic for viewing requests
    if (role === 'employe' && userId) {
      where.requesterId = userId; // Employé ne voit que ses demandes
    }

    const [data, total] = await Promise.all([
      prisma.supplyRequest.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { requester: true, items: { include: { article: true } } },
        orderBy: { requestDate: 'desc' },
      }),
      prisma.supplyRequest.count({ where }),
    ]);

    const formatted = data.map((r) => ({
      ...r,
      userName: `${r.requester.firstName} ${r.requester.lastName}`,
      items: r.items.map(i => ({ ...i, articleName: i.article.name })),
      createdAt: r.requestDate?.toISOString() || new Date().toISOString(),
      updatedAt: r.requestDate?.toISOString() || new Date().toISOString(),
      submittedAt: r.requestDate?.toISOString() || new Date().toISOString(),
      approvedAt: r.requestDate?.toISOString(),
    }));

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getById(id: number) {
    const req = await prisma.supplyRequest.findUnique({
      where: { id },
      include: { requester: true, items: { include: { article: true } }, approver: true },
    });
    if (!req) throw new AppError('Demande introuvable', 404);

    return {
      ...req,
      userName: `${req.requester.firstName} ${req.requester.lastName}`,
      items: req.items.map(i => ({ ...i, articleName: i.article.name })),
      createdAt: req.requestDate?.toISOString() || new Date().toISOString(),
      updatedAt: req.requestDate?.toISOString() || new Date().toISOString(),
      submittedAt: req.requestDate?.toISOString(),
      approvedAt: req.requestDate?.toISOString(),
    };
  },

  async create(userId: number, data: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User introuvable', 404);

    // Get or create department
    let serviceId = user.serviceId;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) service = await prisma.service.create({ data: { name: data.department } });
      serviceId = service.id;
    }
    if (!serviceId) {
      let service = await prisma.service.findFirst();
      if (!service) service = await prisma.service.create({ data: { name: 'Général' } });
      serviceId = service.id;
    }

    const requestNumber = `DEM-${Date.now()}`;

    const req = await prisma.supplyRequest.create({
      data: {
        requestNumber,
        requesterId: userId,
        serviceId,
        priority: data.priority || 'normale',
        justification: data.justification,
        status: 'en_attente',
        items: {
          create: data.items.map((i: any) => ({
            articleId: i.articleId,
            quantity: i.quantity,
          })),
        },
      },
      include: { requester: true, items: { include: { article: true } } },
    });

    return this.getById(req.id);
  },

  async update(id: number, data: any) {
    const req = await prisma.supplyRequest.findUnique({ where: { id } });
    if (!req || req.status !== 'en_attente') {
      throw new AppError('Seules les demandes en brouillon peuvent être modifiées', 400);
    }

    await prisma.requestItem.deleteMany({ where: { requestId: id } });

    let serviceId = undefined;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) service = await prisma.service.create({ data: { name: data.department } });
      serviceId = service.id;
    }

    await prisma.supplyRequest.update({
      where: { id },
      data: {
        priority: data.priority,
        justification: data.justification,
        ...(serviceId ? { serviceId } : {}),
        items: {
          create: data.items.map((i: any) => ({
            articleId: i.articleId,
            quantity: i.quantity,
          })),
        },
      },
    });

    return this.getById(id);
  },

  async submit(id: number) {
    const req = await prisma.supplyRequest.update({
      where: { id },
      data: { status: 'en_attente', requestDate: new Date() },
    });
    return this.getById(req.id);
  },

  async approve(id: number, approverId: number, notes?: string) {
    const req = await prisma.supplyRequest.update({
      where: { id },
      data: {
        status: 'approuvée',
        approverId,
      },
      include: { items: true },
    });

    // Validations table is in French DB
    await prisma.validation.create({
      data: {
        requestId: id,
        approverId,
        decision: 'approuvée',
        comment: notes,
      }
    });

    // Le stock n'est pas déduit ici. Il le sera lors de l'étape de livraison (deliver).

    return this.getById(req.id);
  },

  async deliver(id: number, delivererId: number) {
    const req = await prisma.supplyRequest.findUnique({
      where: { id },
      include: { items: { include: { article: true } } },
    });

    if (!req) throw new AppError('Demande introuvable', 404);
    if (req.status !== 'approuvée') {
      throw new AppError('Seules les demandes approuvées peuvent être livrées', 400);
    }

    // Check stock first
    for (const item of req.items) {
      const currentStock = item.article.quantity || 0;
      if (currentStock < item.quantity) {
        throw new AppError(`Stock insuffisant pour l'article ${item.article.name} (Requis: ${item.quantity}, Actuel: ${currentStock}). Veuillez d'abord vous réapprovisionner.`, 400);
      }
    }

    // Deduct stock and create movements
    for (const item of req.items) {
      const article = item.article;
      const previousStock = article.quantity || 0;
      const newStock = previousStock - item.quantity;

      await prisma.stockMovement.create({
        data: {
          articleId: item.articleId,
          type: 'sortie',
          quantity: item.quantity,
          previousStock,
          newStock,
          reason: `Livraison demande ${req.requestNumber}`,
          userId: delivererId,
        },
      });

      await prisma.article.update({
        where: { id: item.articleId },
        data: { quantity: newStock },
      });

      // Check for alert
      if (newStock <= (article.minStock || 0)) {
        await prisma.stockAlert.create({
          data: {
            articleId: article.id,
            currentStock: newStock,
            minStock: article.minStock,
            status: 'active',
          },
        });
      }
    }

    await prisma.supplyRequest.update({
      where: { id },
      data: { status: 'livrée' },
    });

    return this.getById(id);
  },

  async reject(id: number, rejecterId: number, reason: string) {
    const req = await prisma.supplyRequest.update({
      where: { id },
      data: { status: 'refusée', rejectionReason: reason },
    });

    await prisma.validation.create({
      data: {
        requestId: id,
        approverId: rejecterId,
        decision: 'refusée',
        comment: reason,
      }
    });

    return this.getById(req.id);
  },

  async cancel(id: number) {
    const req = await prisma.supplyRequest.update({
      where: { id },
      data: { status: 'annulée' },
    });
    return this.getById(req.id);
  },

  async delete(id: number) {
    // Delete related records first
    await prisma.validation.deleteMany({ where: { requestId: id } });
    await prisma.requestItem.deleteMany({ where: { requestId: id } });
    await prisma.supplyRequest.delete({ where: { id } });
  },
};
