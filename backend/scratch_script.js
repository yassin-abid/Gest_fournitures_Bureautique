const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRawUnsafe("SELECT pg_get_constraintdef(c.oid) as def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'commandes' AND c.contype = 'c'")
  .then(res => { console.log("CONSTRAINT:"); console.log(res); })
  .catch(err => { console.error("ERROR:"); console.error(err); })
  .finally(() => prisma.$disconnect());
