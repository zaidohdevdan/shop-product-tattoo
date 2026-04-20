"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductStatusAction(productId: string, currentStatus: boolean) {
  await prisma.product.update({
    where: { id: productId },
    data: { active: !currentStatus },
  });
  
  // Limpa o cache para todas as rotas relevantes para exibir a mudança instantaneamente
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/products");
}

export async function saveProductAction(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const priceRaw = formData.get("price") as string;
    const stockRaw = formData.get("stock") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    
    // Validação de presença
    if (!name || !sku || !priceRaw || !categoryId) {
      return { error: "Campos obrigatórios ausentes." };
    }

    const price = parseFloat(priceRaw);
    const stock = parseInt(stockRaw, 10);

    if (isNaN(price)) return { error: "Preço inválido." };
    if (isNaN(stock)) return { error: "Estoque inválido." };
    
    const imagesStrList = formData.getAll("images") as string[];
    // Limpa strings vazias que podem ter vindo por engano (embora getAll retorne apenas o que tem value)
    const images = imagesStrList.filter(Boolean);

    // Geração automatizada de slug amigável com sufixo único para evitar colisões
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Adicionamos um sufixo curto apenas se for um novo produto ou se o nome mudou significativamente
    if (!id) {
      const shortId = Math.random().toString(36).substring(2, 6);
      slug = `${slug}-${shortId}`;
    }

    if (id) {
      await prisma.product.update({
        where: { id },
        data: { name, sku, price, stock, description, categoryId, images },
      });
    } else {
      await prisma.product.create({
        data: { name, slug, sku, price, stock, description, categoryId, images, active: true },
      });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Erro na Server Action saveProductAction:", error);
    return { error: "Ocorreu um erro interno ao salvar o produto." };
  }
}
