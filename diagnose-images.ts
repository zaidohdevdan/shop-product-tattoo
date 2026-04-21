import { PrismaClient } from "@prisma/client";

async function diagnose() {
  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, images: true }
    });

    console.log("=== DIAGNÓSTICO DE IMAGENS ===");
    products.forEach(p => {
      const broken = p.images.filter(img => 
        img.includes("e_background_removal") || 
        img.includes("c_pad") || 
        img.includes("c_fill") ||
        !img.includes("/")
      );
      
      if (broken.length > 0) {
        console.log(`Produto [${p.id}] - ${p.name}`);
        broken.forEach(url => console.log(`  > QUEBRADA: ${url}`));
      }
    });
    console.log("===============================");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
