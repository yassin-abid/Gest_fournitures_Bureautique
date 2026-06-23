const fs = require('fs');

let content = fs.readFileSync('backend/src/middleware/audit.ts', 'utf8');

const fetchEntityReplacement = `const fetchEntity = async (entityType: string, id: number) => {
  switch (entityType) {
    case 'User': return await prisma.user.findUnique({ where: { id }, include: { service: true, role: true } });
    case 'Order': return await prisma.order.findUnique({ where: { id }, include: { supplier: true } });
    case 'SupplyRequest': return await prisma.supplyRequest.findUnique({ where: { id }, include: { service: true } });
    case 'Role': return await prisma.role.findUnique({ where: { id } });
    case 'Category': return await prisma.category.findUnique({ where: { id } });
    case 'Article': return await prisma.article.findUnique({ where: { id }, include: { category: true } });
    case 'Supplier': return await prisma.supplier.findUnique({ where: { id } });
  }
  return null;
};`;

content = content.replace(/const fetchEntity = async \(entityType: string, id: number\) => \{[\s\S]*?return null;\n\};/, fetchEntityReplacement);

fs.writeFileSync('backend/src/middleware/audit.ts', content);
console.log('audit.ts relations included');
