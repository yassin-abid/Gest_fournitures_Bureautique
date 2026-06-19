import { PrismaClient } from '@prisma/client';
import { generateAccessToken } from './src/utils/jwt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'admin@hammemi.com' }, include: { role: true } });
  if (!user) return console.log('No admin user');

  const payload = { userId: user.id, email: user.email, role: user.role?.name || 'admin' };
  const token = generateAccessToken(payload);
  console.log('Token generated:', token);

  try {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('/auth/me response:', res.status, data);
  } catch (err: any) {
    console.log('/auth/me Error:', err);
  }

  try {
    const res2 = await fetch('http://localhost:3000/api/admin/users?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data2 = await res2.json();
    console.log('/admin/users response:', res2.status, data2);
  } catch (err: any) {
    console.log('/admin/users Error:', err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
