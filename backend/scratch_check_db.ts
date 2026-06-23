require('dotenv').config();
const { prisma } = require('./src/config/database');

async function test() {
  try {
    const users = await prisma.user.findMany({
      where: { passwordResetRequested: true }
    });
    console.log("Users requesting reset:", users);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
