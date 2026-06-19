const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.$executeRawUnsafe('ALTER TABLE commandes DROP CONSTRAINT commandes_statut_check');
  await prisma.$executeRawUnsafe("ALTER TABLE commandes ADD CONSTRAINT commandes_statut_check CHECK (statut IN ('en_attente', 'confirmée', 'expédiée', 'partielle', 'livrée', 'annulée'))");
  console.log('Constraint updated successfully');
}
run().catch(console.error).finally(() => prisma.$disconnect());
