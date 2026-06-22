import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  /**
   * Get main analytics dashboard data
   * @param period 'year', 'half', 'quarter'
   */
  async getDashboardData(period: string = 'year') {
    // Determine the start date based on period
    const now = new Date();
    let startDate = new Date();
    if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === 'half') {
      startDate.setMonth(now.getMonth() - 6);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    }

    // 1. Monthly data (total spending & orders)
    // We fetch all orders within period, and their items
    const orders = await prisma.order.findMany({
      where: {
        orderDate: { gte: startDate }
      },
      include: {
        items: true
      }
    });

    const monthlyMap: Record<string, { amount: number; orders: number }> = {};
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    // Initialize all months in period to 0
    let tempDate = new Date(startDate);
    while (tempDate <= now) {
      const label = monthNames[tempDate.getMonth()];
      if (!monthlyMap[label]) {
        monthlyMap[label] = { amount: 0, orders: 0 };
      }
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    orders.forEach(order => {
      if (!order.orderDate) return;
      const monthLabel = monthNames[order.orderDate.getMonth()];
      if (!monthlyMap[monthLabel]) monthlyMap[monthLabel] = { amount: 0, orders: 0 };
      
      monthlyMap[monthLabel].orders += 1;
      
      let orderTotal = 0;
      order.items.forEach(item => {
        orderTotal += (item.unitPrice || 0) * item.quantity;
      });
      monthlyMap[monthLabel].amount += orderTotal;
    });

    const monthlyData = Object.keys(monthlyMap).map(month => ({
      month,
      amount: Math.round(monthlyMap[month].amount),
      orders: monthlyMap[month].orders
    }));

    // 2. Category spending
    // We group order items by article category
    const allOrderItems = await prisma.orderItem.findMany({
      where: {
        order: { orderDate: { gte: startDate } }
      },
      include: {
        article: {
          include: { category: true }
        }
      }
    });

    let totalSpending = 0;
    const categoryMap: Record<string, number> = {};
    allOrderItems.forEach(item => {
      const amount = (item.unitPrice || 0) * item.quantity;
      totalSpending += amount;
      const catName = item.article.category?.name || 'Non catégorisé';
      categoryMap[catName] = (categoryMap[catName] || 0) + amount;
    });

    const colors = ['bg-secondary', 'bg-primary', 'bg-green-500', 'bg-amber-500', 'bg-red-400', 'bg-purple-500', 'bg-indigo-500'];
    const categorySpending = Object.keys(categoryMap)
      .map((name, index) => ({
        name,
        amount: Math.round(categoryMap[name]),
        percentage: totalSpending > 0 ? Math.round((categoryMap[name] / totalSpending) * 100) : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    // 3. Department spending
    // Find all completed supply requests and calculate their value based on approved items * article price
    const requests = await prisma.supplyRequest.findMany({
      where: {
        requestDate: { gte: startDate },
        status: { in: ['approuvée', 'livrée'] }
      },
      include: {
        service: true,
        items: {
          include: { article: true }
        }
      }
    });

    let totalRequestValue = 0;
    const departmentMap: Record<string, number> = {};
    requests.forEach(req => {
      let reqValue = 0;
      req.items.forEach(item => {
        reqValue += (item.approvedQuantity || item.quantity) * (item.article.unitPrice || 0);
      });
      totalRequestValue += reqValue;
      const deptName = req.service?.name || 'Autre';
      departmentMap[deptName] = (departmentMap[deptName] || 0) + reqValue;
    });

    const departmentSpending = Object.keys(departmentMap)
      .map(name => ({
        name,
        amount: Math.round(departmentMap[name]),
        percentage: totalRequestValue > 0 ? Math.round((departmentMap[name] / totalRequestValue) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // 4. Critical Stock
    const criticalArticles = await prisma.article.findMany({
      where: {
        isActive: true,
        // Prisma can't directly compare two columns easily without queryRaw, but since we need full objects:
      },
      include: {
        tarifs: {
          include: { supplier: true }
        }
      }
    });

    const criticalStock = criticalArticles
      .filter(a => (a.quantity || 0) <= (a.minStock || 0))
      .map(a => ({
        article: a.name,
        stock: a.quantity || 0,
        threshold: a.minStock || 0,
        supplier: a.tarifs && a.tarifs.length > 0 ? a.tarifs[0].supplier.name : 'Inconnu'
      }));

    // 5. AI Forecasts (Read from table)
    const forecasts = await prisma.previsionsAchats.findMany({
      include: { article: true },
      orderBy: { dateGeneration: 'desc' },
      take: 20
    });

    const aiForecasts = forecasts.map(f => {
      // Simulate trend based on data if not explicit
      let trend = 'stable';
      if ((f.quantitePrevue || 0) > (f.quantiteRecom || 0)) trend = 'up';
      else if ((f.quantitePrevue || 0) < (f.quantiteRecom || 0)) trend = 'down';

      return {
        article: f.article.name,
        currentStock: f.article.quantity || 0,
        threshold: f.article.minStock || 0,
        forecast1m: f.quantitePrevue || 0,
        forecast3m: (f.quantitePrevue || 0) * 3, // Simplification
        trend,
        confidence: Math.round((f.scorePriorite || 0.8) * 100)
      };
    });

    // 6. Auto Suggestions
    // Base on critical stock + forecast
    const autoSuggestions = criticalStock.map(c => {
      const articleDetails = criticalArticles.find(a => a.name === c.article);
      const targetStock = articleDetails?.maxStock || (c.threshold * 3);
      const toOrder = Math.max(1, targetStock - c.stock);
      
      let urgency = 'medium';
      if (c.stock === 0) urgency = 'urgent';
      else if (c.stock < c.threshold / 2) urgency = 'high';

      return {
        article: c.article,
        suggestedQty: toOrder,
        reason: c.stock === 0 ? 'Rupture de stock !' : `Stock sous le seuil critique (${c.stock} restants)`,
        urgency
      };
    });

    return {
      monthlyData,
      categorySpending,
      departmentSpending,
      aiForecasts,
      autoSuggestions,
      criticalStock
    };
  }
}

export const analyticsService = new AnalyticsService();
