import { prisma } from '@config/database';
import { AppError } from '@middleware/errorHandler';
import { getPrismaSkip, buildPaginatedResult } from '@utils/pagination';

// ─── Articles ───────────────────────────────────────────────

export const articleService = {
  async getAll(page: number, limit: number, search = '', categoryId?: number, status?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status) where.isActive = status === 'active';

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { category: true, tarifs: { include: { supplier: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.article.count({ where }),
    ]);

    const formatted = data.map((a) => ({
      ...a,
      categoryName: a.category?.name || 'Non catérogisé',
      supplierName: a.tarifs?.[0]?.supplier?.name || 'Aucun fournisseur',
      createdAt: new Date().toISOString(), // Mocked since no date on articles
      updatedAt: new Date().toISOString(),
      status: a.isActive ? 'active' : 'inactive',
    }));

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getById(id: number) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true, tarifs: { include: { supplier: true } } },
    });
    if (!article) throw new AppError('Article introuvable', 404);
    return {
      ...article,
      categoryName: article.category?.name || 'Non catérogisé',
      supplierName: article.tarifs?.[0]?.supplier?.name || 'Aucun fournisseur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: article.isActive ? 'active' : 'inactive',
    };
  },

  async create(data: any) {
    // If supplierId is provided, we create a tarif
    const { supplierId, ...articleData } = data;
    
    // Map status to isActive
    if (articleData.status !== undefined) {
      articleData.isActive = articleData.status === 'active';
      delete articleData.status;
    }

    const article = await prisma.article.create({
      data: {
        ...articleData,
        ...(supplierId ? { tarifs: { create: { supplierId, price: articleData.unitPrice || 0 } } } : {}),
      },
      include: { category: true, tarifs: { include: { supplier: true } } },
    });

    return {
      ...article,
      categoryName: article.category?.name || 'Non catérogisé',
      supplierName: article.tarifs?.[0]?.supplier?.name || 'Aucun fournisseur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: article.isActive ? 'active' : 'inactive',
    };
  },

  async update(id: number, data: any) {
    const { supplierId, ...articleData } = data;
    
    if (articleData.status !== undefined) {
      articleData.isActive = articleData.status === 'active';
      delete articleData.status;
    }

    // Update supplier via tarifs if supplierId is provided
    if (supplierId) {
      const existingTarif = await prisma.tarif.findFirst({ where: { articleId: id } });
      if (existingTarif) {
        await prisma.tarif.update({ where: { id: existingTarif.id }, data: { supplierId } });
      } else {
        await prisma.tarif.create({ data: { articleId: id, supplierId, price: articleData.unitPrice || 0 } });
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: articleData,
      include: { category: true, tarifs: { include: { supplier: true } } },
    });

    return {
      ...article,
      categoryName: article.category?.name || 'Non catérogisé',
      supplierName: article.tarifs?.[0]?.supplier?.name || 'Aucun fournisseur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: article.isActive ? 'active' : 'inactive',
    };
  },

  async delete(id: number) {
    await prisma.article.update({ where: { id }, data: { isActive: false } });
  },
};

// ─── Categories ─────────────────────────────────────────────

export const categoryService = {
  async getAll() {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => ({
      ...c,
      itemCount: c._count.articles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  async getById(id: number) {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) throw new AppError('Catégorie introuvable', 404);
    return { ...cat, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },

  async create(data: any) {
    const { name, description } = data;
    const cat = await prisma.category.create({ data: { name, description } });
    return { ...cat, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },

  async update(id: number, data: any) {
    const { name, description } = data;
    const cat = await prisma.category.update({ where: { id }, data: { name, description } });
    return { ...cat, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },

  async delete(id: number) {
    await prisma.category.delete({ where: { id } });
  },
};

// ─── Suppliers ──────────────────────────────────────────────

export const supplierService = {
  async getAll(page: number, limit: number, search = '') {
    const where: any = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { contact: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [data, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supplier.count({ where }),
    ]);

    const formatted = data.map((s) => ({
      ...s,
      contactPerson: s.contact, // map back to frontend expectation
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: s.createdAt?.toISOString() || new Date().toISOString(),
      status: 'active',
    }));

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getById(id: number) {
    const s = await prisma.supplier.findUnique({ where: { id } });
    if (!s) throw new AppError('Fournisseur introuvable', 404);
    return { 
      ...s, 
      contactPerson: s.contact,
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      updatedAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      status: 'active' 
    };
  },

  async create(data: any) {
    const { name, contactPerson, contact, email, phone, address } = data;
    const s = await prisma.supplier.create({ 
      data: { name, contact: contactPerson || contact, email, phone, address } 
    });
    return { 
      ...s, 
      contactPerson: s.contact,
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      updatedAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      status: 'active' 
    };
  },

  async update(id: number, data: any) {
    const { name, contactPerson, contact, email, phone, address } = data;
    const s = await prisma.supplier.update({ 
      where: { id }, 
      data: { name, contact: contactPerson || contact, email, phone, address } 
    });
    return { 
      ...s, 
      contactPerson: s.contact,
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      updatedAt: s.createdAt?.toISOString() || new Date().toISOString(), 
      status: 'active' 
    };
  },

  async delete(id: number) {
    // Delete is not straightforward if it's referenced in Orders, etc.
    // For now we just throw an error or leave it since supplier doesn't have isActive
    throw new AppError('Suppression de fournisseur non supportée pour le moment', 400);
  },
};
