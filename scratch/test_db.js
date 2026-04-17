import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ take: 1 });
    console.log('DB Connection Success:', products);
  } catch (error) {
    console.error('DB Connection Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
