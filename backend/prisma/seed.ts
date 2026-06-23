import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data
  await prisma.validation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.inventaire.deleteMany();
  await prisma.anomaliesConsommation.deleteMany();
  await prisma.previsionsAchats.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockAlert.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.requestItem.deleteMany();
  await prisma.supplyRequest.deleteMany();
  await prisma.tarif.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.service.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Roles
  const roleAdmin = await prisma.role.create({ data: { name: 'admin' } });
  const roleRespService = await prisma.role.create({ data: { name: 'responsable_service' } });
  const roleGestStock = await prisma.role.create({ data: { name: 'gestionnaire_stock' } });
  const roleRespAchats = await prisma.role.create({ data: { name: 'responsable_achats' } });
  const roleEmploye = await prisma.role.create({ data: { name: 'employe' } });

  // 3. Services
  const srvInfo = await prisma.service.create({ data: { name: 'Informatique' } });
  const srvRH = await prisma.service.create({ data: { name: 'Ressources Humaines' } });
  const srvLog = await prisma.service.create({ data: { name: 'Logistique' } });
  const srvAchat = await prisma.service.create({ data: { name: 'Achats & Finance' } });
  const srvCom = await prisma.service.create({ data: { name: 'Commercial' } });
  const services = [srvInfo, srvRH, srvLog, srvAchat, srvCom];

  // 4. Users
  const admin = await prisma.user.create({
    data: { email: 'admin@hammemi.com', passwordHash, firstName: 'Karim', lastName: 'Administrateur', roleId: roleAdmin.id, serviceId: srvInfo.id },
  });
  const respService = await prisma.user.create({
    data: { email: 'resp.service@hammemi.com', passwordHash, firstName: 'Sonia', lastName: 'Ben Ali', roleId: roleRespService.id, serviceId: srvRH.id },
  });
  const gestStock = await prisma.user.create({
    data: { email: 'gestionnaire.stock@hammemi.com', passwordHash, firstName: 'Mourad', lastName: 'Gharbi', roleId: roleGestStock.id, serviceId: srvLog.id },
  });
  const respAchats = await prisma.user.create({
    data: { email: 'resp.achats@hammemi.com', passwordHash, firstName: 'Leila', lastName: 'Mansour', roleId: roleRespAchats.id, serviceId: srvAchat.id },
  });
  const employe = await prisma.user.create({
    data: { email: 'employe@hammemi.com', passwordHash, firstName: 'Youssef', lastName: 'Trabelsi', roleId: roleEmploye.id, serviceId: srvCom.id },
  });

  // 5. Categories
  const catPapeterie = await prisma.category.create({ data: { name: 'Papeterie' } });
  const catInformatique = await prisma.category.create({ data: { name: 'Matériel Informatique' } });
  const catMobilier = await prisma.category.create({ data: { name: 'Mobilier de bureau' } });
  const catAccessoires = await prisma.category.create({ data: { name: 'Accessoires' } });

  // 6. Suppliers
  const supplier1 = await prisma.supplier.create({ data: { name: 'OfficePlus Tunisie', email: 'contact@officeplus.tn', phone: '71 123 456' } });
  const supplier2 = await prisma.supplier.create({ data: { name: 'TechStore', email: 'sales@techstore.tn', phone: '71 987 654' } });
  const supplier3 = await prisma.supplier.create({ data: { name: 'Meubles Pro', email: 'pro@meubles.tn', phone: '73 111 222' } });

  // 7. Articles
  const articlesData = [
    { code: 'PAP-001', name: 'Ramette papier A4', catId: catPapeterie.id, supId: supplier1.id, price: 15.5, stock: 50, min: 100 }, // Critical stock
    { code: 'PAP-002', name: 'Stylo à bille bleu', catId: catPapeterie.id, supId: supplier1.id, price: 2.0, stock: 200, min: 50 },
    { code: 'PAP-003', name: 'Cahier spirale 200p', catId: catPapeterie.id, supId: supplier1.id, price: 8.0, stock: 15, min: 40 }, // Critical stock
    { code: 'INFO-001', name: 'Souris sans fil', catId: catInformatique.id, supId: supplier2.id, price: 45.0, stock: 30, min: 20 },
    { code: 'INFO-002', name: 'Clavier ergonomique', catId: catInformatique.id, supId: supplier2.id, price: 120.0, stock: 10, min: 15 }, // Critical stock
    { code: 'INFO-003', name: 'Écran 24 pouces Dell', catId: catInformatique.id, supId: supplier2.id, price: 650.0, stock: 5, min: 5 },
    { code: 'MOB-001', name: 'Chaise ergonomique', catId: catMobilier.id, supId: supplier3.id, price: 850.0, stock: 12, min: 10 },
    { code: 'MOB-002', name: 'Bureau direction', catId: catMobilier.id, supId: supplier3.id, price: 1200.0, stock: 4, min: 5 }, // Critical stock
    { code: 'ACC-001', name: 'Multiprise 5 prises', catId: catAccessoires.id, supId: supplier2.id, price: 25.0, stock: 45, min: 20 },
    { code: 'ACC-002', name: 'Agrafeuse pro', catId: catAccessoires.id, supId: supplier1.id, price: 35.0, stock: 18, min: 10 },
  ];

  const articles = [];
  for (const a of articlesData) {
    const art = await prisma.article.create({
      data: {
        code: a.code, name: a.name, categoryId: a.catId, unit: 'Unité',
        quantity: a.stock, minStock: a.min, unitPrice: a.price
      }
    });
    await prisma.tarif.create({ data: { articleId: art.id, supplierId: a.supId, price: a.price } });
    articles.push(art);

    if (a.stock <= a.min) {
      await prisma.stockAlert.create({
        data: { articleId: art.id, minStock: a.min, currentStock: a.stock, status: 'active' }
      });
    }
  }

  // 8. Generate historical Orders (to populate the Spending Chart)
  console.log('🛒 Generating historical orders...');
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const now = new Date();

  for (let i = 0; i < 40; i++) {
    const orderDate = randomDate(oneYearAgo, now);
    const supplier = [supplier1, supplier2, supplier3][Math.floor(Math.random() * 3)];
    
    // Pick 2 to 4 random articles
    const numItems = Math.floor(Math.random() * 3) + 2;
    const items = [];
    for (let j = 0; j < numItems; j++) {
      const art = articles[Math.floor(Math.random() * articles.length)];
      const qty = Math.floor(Math.random() * 50) + 10;
      const price = articlesData.find(a => a.code === art.code)?.price || 10;
      items.push({ articleId: art.id, quantity: qty, unitPrice: price });
    }

    await prisma.order.create({
      data: {
        orderNumber: `CMD-${orderDate.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        supplierId: supplier.id,
        buyerId: respAchats.id,
        orderDate: orderDate,
        status: 'livrée',
        items: {
          create: items
        }
      }
    });
  }

  // 9. Generate historical Supply Requests (to populate Department spending)
  console.log('📝 Generating historical supply requests...');
  for (let i = 0; i < 60; i++) {
    const reqDate = randomDate(oneYearAgo, now);
    const service = services[Math.floor(Math.random() * services.length)];
    
    // Create request
    const req = await prisma.supplyRequest.create({
      data: {
        requestNumber: `REQ-${reqDate.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        requesterId: employe.id,
        serviceId: service.id,
        requestDate: reqDate,
        status: 'livrée',
        priority: 'normale',
        items: {
          create: [
            { articleId: articles[0].id, quantity: Math.floor(Math.random() * 5) + 1, approvedQuantity: Math.floor(Math.random() * 5) + 1 },
            { articleId: articles[3].id, quantity: Math.floor(Math.random() * 2) + 1, approvedQuantity: Math.floor(Math.random() * 2) + 1 }
          ]
        }
      }
    });

    // Link a fake order for cost tracking
    await prisma.order.create({
      data: {
        orderNumber: `CMD-REQ-${req.id}`,
        requestId: req.id,
        supplierId: supplier1.id,
        buyerId: respAchats.id,
        orderDate: reqDate,
        status: 'livrée',
        items: {
          create: [
            { articleId: articles[0].id, quantity: 5, unitPrice: 15.5 }
          ]
        }
      }
    });
  }

  // 10. Previsions Achats (AI)
  console.log('🤖 Generating AI forecasts...');
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const next3Months = new Date();
  next3Months.setMonth(next3Months.getMonth() + 3);

  for (let i = 0; i < 5; i++) {
    await prisma.previsionsAchats.create({
      data: {
        articleId: articles[i].id,
        moisPrevision: nextMonth,
        quantitePrevue: Math.floor(Math.random() * 100) + 50,
        quantiteRecom: Math.floor(Math.random() * 120) + 60,
        scorePriorite: Math.random() * 100, // confidence
        modeleIa: 'v2.5-flash',
      }
    });
  }

  // 11. Anomalies
  console.log('⚠️ Generating anomalies...');
  await prisma.anomaliesConsommation.create({
    data: {
      articleId: articles[0].id, // Ramette
      serviceId: srvInfo.id,
      description: 'Consommation de papier anormalement élevée (+450% par rapport à la moyenne)',
      niveauRisque: 'lev_',
    }
  });

  console.log('✅ Rich Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
