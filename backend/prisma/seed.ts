import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data (Order matters for foreign keys)
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

  // 2. Hash common password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 3. Create Roles
  console.log('🛡️  Creating roles...');
  const roleAdmin = await prisma.role.create({ data: { name: 'admin' } });
  const roleRespService = await prisma.role.create({ data: { name: 'responsable_service' } });
  const roleGestStock = await prisma.role.create({ data: { name: 'gestionnaire_stock' } });
  const roleRespAchats = await prisma.role.create({ data: { name: 'responsable_achats' } });
  const roleEmploye = await prisma.role.create({ data: { name: 'employe' } });

  // 4. Create Services
  console.log('🏢 Creating services...');
  const srvInfo = await prisma.service.create({ data: { name: 'Informatique' } });
  const srvRH = await prisma.service.create({ data: { name: 'Ressources Humaines' } });
  const srvLog = await prisma.service.create({ data: { name: 'Logistique' } });
  const srvAchat = await prisma.service.create({ data: { name: 'Achats & Finance' } });
  const srvCom = await prisma.service.create({ data: { name: 'Commercial' } });

  // 5. Create Demo Users (matching frontend DEMO_CREDENTIALS)
  console.log('👤 Creating users...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hammemi.com',
      passwordHash,
      firstName: 'Karim',
      lastName: 'Administrateur',
      roleId: roleAdmin.id,
      serviceId: srvInfo.id,
    },
  });

  const respService = await prisma.user.create({
    data: {
      email: 'resp.service@hammemi.com',
      passwordHash,
      firstName: 'Sonia',
      lastName: 'Ben Ali',
      roleId: roleRespService.id,
      serviceId: srvRH.id,
    },
  });

  const gestStock = await prisma.user.create({
    data: {
      email: 'gestionnaire.stock@hammemi.com',
      passwordHash,
      firstName: 'Mourad',
      lastName: 'Gharbi',
      roleId: roleGestStock.id,
      serviceId: srvLog.id,
    },
  });

  const respAchats = await prisma.user.create({
    data: {
      email: 'resp.achats@hammemi.com',
      passwordHash,
      firstName: 'Leila',
      lastName: 'Mansour',
      roleId: roleRespAchats.id,
      serviceId: srvAchat.id,
    },
  });

  const employe = await prisma.user.create({
    data: {
      email: 'employe@hammemi.com',
      passwordHash,
      firstName: 'Youssef',
      lastName: 'Trabelsi',
      roleId: roleEmploye.id,
      serviceId: srvCom.id,
    },
  });

  // 6. Create Categories
  console.log('📂 Creating categories...');
  const catPapeterie = await prisma.category.create({ data: { name: 'Papeterie', description: 'Fournitures de bureau générales' } });
  const catInformatique = await prisma.category.create({ data: { name: 'Matériel Informatique', description: 'Equipements et accessoires IT' } });
  const catMobilier = await prisma.category.create({ data: { name: 'Mobilier de bureau', description: 'Meubles et chaises' } });

  // 7. Create Suppliers
  console.log('🏭 Creating suppliers...');
  const supplier1 = await prisma.supplier.create({
    data: { name: 'OfficePlus Tunisie', email: 'contact@officeplus.tn', phone: '71 123 456', address: 'Tunis' },
  });
  const supplier2 = await prisma.supplier.create({
    data: { name: 'TechStore', email: 'sales@techstore.tn', phone: '71 987 654', address: 'Sfax' },
  });

  // 8. Create Articles & Tarifs
  console.log('📦 Creating articles & tarifs...');
  const artRam = await prisma.article.create({
    data: {
      code: 'PAP-001',
      name: 'Ramette papier A4',
      categoryId: catPapeterie.id,
      unit: 'Ramette',
      quantity: 50,
      minStock: 20,
    },
  });
  await prisma.tarif.create({ data: { articleId: artRam.id, supplierId: supplier1.id, price: 15.5 } });

  const artStylo = await prisma.article.create({
    data: {
      code: 'PAP-002',
      name: 'Stylo à bille bleu (Boîte de 50)',
      categoryId: catPapeterie.id,
      unit: 'Boîte',
      quantity: 5,
      minStock: 10,
    },
  });
  await prisma.tarif.create({ data: { articleId: artStylo.id, supplierId: supplier1.id, price: 25.0 } });

  const artSouris = await prisma.article.create({
    data: {
      code: 'INFO-001',
      name: 'Souris sans fil Logitech',
      categoryId: catInformatique.id,
      unit: 'Unité',
      quantity: 15,
      minStock: 5,
    },
  });
  await prisma.tarif.create({ data: { articleId: artSouris.id, supplierId: supplier2.id, price: 45.0 } });

  // 9. Create Sample Stock Alert
  console.log('⚠️ Creating stock alerts...');
  await prisma.stockAlert.create({
    data: {
      articleId: artStylo.id,
      minStock: artStylo.minStock,
      currentStock: artStylo.quantity,
      status: 'active',
    },
  });

  // 10. Create Sample Supply Request
  console.log('📝 Creating requests...');
  await prisma.supplyRequest.create({
    data: {
      requestNumber: 'REQ-2026-0001',
      requesterId: employe.id,
      serviceId: srvCom.id,
      status: 'en_attente',
      priority: 'haute',
      justification: 'Besoin urgent pour nouveau projet',
      items: {
        create: [
          { articleId: artRam.id, quantity: 5 },
          { articleId: artStylo.id, quantity: 1 },
        ],
      },
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
