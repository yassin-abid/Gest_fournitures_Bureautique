import { prisma } from '../../config/database';

export const reportsService = {
  async getSummary(startDate?: string, endDate?: string) {
    const whereReq: any = {};
    const whereOrd: any = {};
    if (startDate || endDate) {
      if (startDate) {
        whereReq.requestDate = { gte: new Date(startDate) };
        whereOrd.orderDate = { gte: new Date(startDate) };
      }
      if (endDate) {
        whereReq.requestDate = { ...whereReq.requestDate, lte: new Date(endDate) };
        whereOrd.orderDate = { ...whereOrd.orderDate, lte: new Date(endDate) };
      }
    }

    const [
      totalRequests,
      pendingRequests,
      totalOrders,
      pendingOrders,
      activeAlerts,
    ] = await Promise.all([
      prisma.supplyRequest.count({ where: whereReq }),
      prisma.supplyRequest.count({ where: { ...whereReq, status: 'en_attente' } }),
      prisma.order.count({ where: whereOrd }),
      prisma.order.count({ where: { ...whereOrd, status: 'en_attente' } }),
      prisma.stockAlert.count({ where: { status: 'active' } }),
    ]);

    const articles = await prisma.article.findMany();
    const lowStockArticles = articles.filter(a => (a.quantity || 0) <= (a.minStock || 0)).length;

    // Calculate budget spent from approved requests
    const approvedReqs = await prisma.supplyRequest.findMany({
      where: { ...whereReq, status: 'approuvée' },
      include: { items: { include: { article: { include: { tarifs: true } } } } },
    });

    let budgetSpent = 0;
    approvedReqs.forEach(req => {
      req.items.forEach(item => {
        const price = item.article.tarifs?.[0]?.price || 0;
        budgetSpent += item.quantity * price;
      });
    });

    return {
      totalRequests,
      pendingRequests,
      totalOrders,
      pendingOrders,
      lowStockArticles,
      activeAlerts,
      budgetSpent,
    };
  },

  async getRequestsAnalytics(startDate?: string, endDate?: string) {
    const whereDate: any = {};
    if (startDate) whereDate.requestDate = { gte: new Date(startDate) };
    if (endDate) whereDate.requestDate = { ...whereDate.requestDate, lte: new Date(endDate) };

    const statusCounts = await prisma.supplyRequest.groupBy({
      by: ['status'],
      _count: { id: true },
      where: whereDate,
    });

    const departmentCounts = await prisma.supplyRequest.groupBy({
      by: ['serviceId'],
      _count: { id: true },
      where: { ...whereDate, serviceId: { not: null } },
    });

    const services = await prisma.service.findMany();
    const serviceMap = new Map(services.map(s => [s.id, s.name]));

    return {
      byStatus: statusCounts.map(s => ({ status: s.status, count: s._count.id })),
      byDepartment: departmentCounts.map(d => ({ department: serviceMap.get(d.serviceId!) || 'Général', count: d._count.id })),
    };
  },

  async getStockAnalytics() {
    const categories = await prisma.category.findMany({
      include: { articles: { include: { tarifs: true } } },
    });

    const stockByCategory = categories.map(cat => {
      const totalItems = cat.articles.length;
      const totalValue = cat.articles.reduce((sum, art) => {
        const price = art.tarifs?.[0]?.price || 0;
        return sum + ((art.quantity || 0) * price);
      }, 0);
      const lowStockCount = cat.articles.filter(art => (art.quantity || 0) <= (art.minStock || 0)).length;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        totalItems,
        totalValue,
        lowStockCount,
      };
    });

    return stockByCategory;
  },
};
