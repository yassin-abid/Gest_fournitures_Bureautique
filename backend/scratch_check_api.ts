require('dotenv').config();
const { adminService } = require('./src/modules/admin/admin.service');
const { prisma } = require('./src/config/database');

async function test() {
  try {
    const res = await adminService.getUsers(1, 10);
    console.log(res.users.find(u => u.email === 'admin@hammemi.com'));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
