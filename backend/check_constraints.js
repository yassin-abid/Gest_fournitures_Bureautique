const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConstraints() {
  try {
    const res = await prisma.$queryRaw`
      SELECT conname, pg_get_constraintdef(c.oid) AS definition
      FROM pg_constraint c
      WHERE conname IN ('demandes_statut_check', 'validations_decision_check', 'commandes_statut_check');
    `;
    console.log(res);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkConstraints();
