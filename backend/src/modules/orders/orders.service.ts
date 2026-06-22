import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { getPrismaSkip, buildPaginatedResult } from '../../utils/pagination';
import { Prisma } from '@prisma/client';

// Helper: fetch requestNumber for a single order id via raw SQL
async function fetchRequestNumber(orderId: number): Promise<{ requestId: number; requestNumber: string } | null> {
  try {
    const rows = await prisma.$queryRaw<Array<{ request_id: number; request_number: string }>>(
      Prisma.sql`
        SELECT d.id AS request_id, d.numero AS request_number
        FROM commandes c
        JOIN demandes d ON d.id = c.demande_id
        WHERE c.id = ${orderId}
        LIMIT 1
      `
    );
    if (rows.length > 0 && rows[0].request_number) {
      return { requestId: Number(rows[0].request_id), requestNumber: rows[0].request_number };
    }
    return null;
  } catch (err: any) {
    console.error('[fetchRequestNumber] SQL error:', err.message);
    return null;
  }
}

export const ordersService = {
  async getAll(page: number, limit: number, status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { supplier: true, items: { include: { article: true } } },
        orderBy: { orderDate: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    // Fetch request info in parallel for each order
    const requestInfos = await Promise.all(data.map((o) => fetchRequestNumber(o.id)));

    const formatted = data.map((o, idx) => {
      const reqInfo = requestInfos[idx];
      return {
        ...o,
        supplierName: o.supplier.name,
        requestId: reqInfo?.requestId,
        requestNumber: reqInfo?.requestNumber,
        items: o.items.map((i) => ({ ...i, articleName: i.article.name })),
        createdAt: o.orderDate?.toISOString() || new Date().toISOString(),
        updatedAt: o.orderDate?.toISOString() || new Date().toISOString(),
        expectedDeliveryDate: o.expectedDelivery?.toISOString(),
        actualDeliveryDate: o.actualDelivery?.toISOString(),
      };
    });

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getById(id: number) {
    const o = await prisma.order.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { article: true } } },
    });
    if (!o) throw new AppError('Commande introuvable', 404);

    const reqInfo = await fetchRequestNumber(id);

    return {
      ...o,
      supplierName: o.supplier.name,
      requestId: reqInfo?.requestId,
      requestNumber: reqInfo?.requestNumber,
      items: o.items.map((i) => ({ ...i, articleName: i.article.name })),
      createdAt: o.orderDate?.toISOString() || new Date().toISOString(),
      updatedAt: o.orderDate?.toISOString() || new Date().toISOString(),
      expectedDeliveryDate: o.expectedDelivery?.toISOString(),
      actualDeliveryDate: o.actualDelivery?.toISOString(),
    };
  },

  async create(data: any, buyerId: number) {
    if (data.requestId) {
      const existing = await prisma.$queryRaw<Array<{ id: number }>>(
        Prisma.sql`SELECT id FROM commandes WHERE demande_id = ${Number(data.requestId)} LIMIT 1`
      );
      if (existing.length > 0) {
        throw new AppError('Cette demande a déjà une commande associée', 400);
      }
    }

    const orderNumber = `CMD-${Date.now()}`;
    const o = await prisma.order.create({
      data: {
        orderNumber,
        supplierId: data.supplierId,
        buyerId,
        expectedDelivery: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
        status: 'confirmée',
        items: {
          create: data.items.map((i: any) => ({
            articleId: i.articleId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
      include: { supplier: true, items: { include: { article: true } } },
    });

    // Set demande_id and update demande status via raw SQL (Prisma client not regenerated)
    if (data.requestId) {
      try {
        const reqId = Number(data.requestId);
        const ordId = Number(o.id);
        const statusTraite = 'traitee';
        await prisma.$executeRaw(Prisma.sql`UPDATE commandes SET demande_id = ${reqId} WHERE id = ${ordId}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE demandes SET statut = ${statusTraite} WHERE id = ${reqId}`);
      } catch (rawErr: any) {
        console.error('[orders.service] raw SQL update failed:', rawErr.message);
      }
    }

    return this.getById(o.id);
  },

  async update(id: number, data: any) {
    const current = await prisma.order.findUnique({ where: { id } });
    if (!current || current.status !== 'en_attente') {
      throw new AppError('Seules les commandes en attente peuvent être modifiées', 400);
    }

    await prisma.orderItem.deleteMany({ where: { orderId: id } });

    await prisma.order.update({
      where: { id },
      data: {
        supplierId: data.supplierId,
        expectedDelivery: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
        items: {
          create: data.items.map((i: any) => ({
            articleId: i.articleId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
    });

    return this.getById(id);
  },

  async confirm(id: number) {
    await prisma.order.update({ where: { id }, data: { status: 'confirmée' } });
    return this.getById(id);
  },

  async ship(id: number, trackingNumber?: string) {
    await prisma.order.update({
      where: { id },
      data: { status: 'expédiée' },
    });
    return this.getById(id);
  },

  async receive(id: number, itemsReceived: Array<{ itemId: number; quantity: number }>, userId: number) {
    const o = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!o || o.status === 'livrée') throw new AppError('Commande introuvable ou déjà livrée', 400);

    let allReceived = true;

    for (const receivedData of itemsReceived) {
      const orderItem = o.items.find((i) => i.id === receivedData.itemId);
      if (!orderItem) continue;

      const newReceivedQty = (orderItem.received || 0) + receivedData.quantity;
      if (newReceivedQty < orderItem.quantity) allReceived = false;

      await prisma.orderItem.update({
        where: { id: receivedData.itemId },
        data: { received: newReceivedQty },
      });

      const article = await prisma.article.findUnique({ where: { id: orderItem.articleId } });
      if (!article) continue;

      const previousStock = article.quantity || 0;
      const newStock = previousStock + receivedData.quantity;

      await prisma.stockMovement.create({
        data: {
          articleId: orderItem.articleId,
          type: 'entrée',
          quantity: receivedData.quantity,
          previousStock,
          newStock,
          reference: o.orderNumber,
          reason: `Réception commande ${o.orderNumber}`,
          userId,
        },
      });

      await prisma.article.update({
        where: { id: orderItem.articleId },
        data: { quantity: newStock },
      });

      if (newStock > (article.minStock || 0)) {
        await prisma.stockAlert.updateMany({
          where: { articleId: article.id, status: 'active' },
          data: { status: 'résolue' },
        });
      }
    }

    await prisma.order.update({
      where: { id },
      data: {
        status: allReceived ? 'livrée' : 'partielle',
        actualDelivery: allReceived ? new Date() : null,
      },
    });

    // Update linked SupplyRequest via raw SQL
    if (allReceived) {
      const linked = await prisma.$queryRaw<Array<{ demande_id: number }>>`
        SELECT demande_id FROM commandes WHERE id = ${id} AND demande_id IS NOT NULL
      `;
      if (linked.length > 0 && linked[0].demande_id) {
        await prisma.$executeRaw`UPDATE demandes SET statut = ${'livrée'} WHERE id = ${linked[0].demande_id}`;
      }
    }

    return this.getById(id);
  },

  async cancel(id: number, reason?: string) {
    await prisma.order.update({
      where: { id },
      data: { status: 'annulée' },
    });
    return this.getById(id);
  },

  async delete(id: number) {
    // Delete order items first to avoid foreign key constraint errors
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
  },
};
