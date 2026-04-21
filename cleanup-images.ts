
import { PrismaClient } from "@prisma/client";

async function cleanup() {
  const prisma = new PrismaClient();
  
  try {
    console.log("Iniciando limpeza de imagens corrompidas...");
    const products = await prisma.product.findMany();
    
    for (const product of products) {
      const originalCount = product.images.length;
      const filteredImages = product.images.filter(url => {
        if (!url) return false;
        if (!url.includes('cloudinary.com')) return true;
        
        const brokenPatterns = ['/c_pad', '/c_fill', '/e_background_removal'];
        const isTruncated = brokenPatterns.some(pattern => url.endsWith(pattern));
        const isTooShort = url.split('/').length <= 6;
        
        return !isTruncated && !isTooShort;
      });

      if (filteredImages.length !== originalCount) {
        console.log(`Corrigindo produto: ${product.name} (Removidas ${originalCount - filteredImages.length} imagens)`);
        await prisma.product.update({
          where: { id: product.id },
          data: { images: filteredImages }
        });
      }
    }
    
    console.log("Limpeza concluída com sucesso.");
  } catch (error) {
    console.error("Erro durante a limpeza:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
