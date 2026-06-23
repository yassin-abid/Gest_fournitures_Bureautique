require('dotenv').config();
const { authService } = require('./src/modules/auth/auth.service');
const { prisma } = require('./src/config/database');

async function test() {
  try {
    const res = await authService.requestPasswordReset('admin@hammemi.com');
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
