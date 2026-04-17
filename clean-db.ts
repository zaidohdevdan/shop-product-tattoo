import { prisma } from './src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    const originalLength = product.images.length;
    
    // Filtra array para manter apeans URLs válidas (começam com http, https ou /)
    const newImages = product.images.filter(url => 
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('/')
    );

    if (newImages.length !== originalLength) {
      console.log(`Cleaning corrupted image slices for product ${product.id}`);
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      });
    }
  }
  console.log("Database perfectly cleaned.");
}

main().catch(console.error).finally(() => process.exit(0));
