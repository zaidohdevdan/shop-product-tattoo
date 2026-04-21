"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";

export async function toggleProductStatusAction(productId: string, currentStatus: boolean) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { active: !currentStatus },
    });
    
    // ✅ [PERF] Invalida cache de inventário imediatamente
    updateTag("inventory");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    
    return { success: true };
  } catch (error) {
    console.error("Erro crítico na Server Action toggleProductStatusAction:", error);
    return { error: "Erro de conexão com o servidor. Tente atualizar a página." };
  }
}

export async function saveProductAction(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const priceRaw = formData.get("price") as string;
    const costPriceRaw = formData.get("costPrice") as string;
    const stockRaw = formData.get("stock") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    
    // Validação de presença
    if (!name || !sku || !priceRaw || !costPriceRaw || !categoryId) {
      return { error: "Campos obrigatórios ausentes." };
    }

    const price = parseFloat(priceRaw);
    const costPrice = parseFloat(costPriceRaw);
    const stock = parseInt(stockRaw, 10);

    if (isNaN(price)) return { error: "Preço inválido." };
    if (isNaN(costPrice)) return { error: "Preço de custo inválido." };
    if (isNaN(stock)) return { error: "Estoque inválido." };
    
    const imagesStrList = formData.getAll("images") as string[];
    
    // Função para validar URLs completas e seguras
    const isValidUrl = (url: string) => {
      if (!url) return false;
      if (!url.includes('cloudinary.com')) return true;
      const brokenPatterns = ['/c_pad', '/c_fill', '/e_background_removal'];
      return !brokenPatterns.some(pattern => url.endsWith(pattern)) && url.split('/').length > 6;
    };

    const images = imagesStrList.filter(isValidUrl);

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
        data: { name, sku, price, costPrice, stock, description, categoryId, images },
      });
    } else {
      await prisma.product.create({
        data: { name, slug, sku, price, costPrice, stock, description, categoryId, images, active: true },
      });
    }

    // ✅ [PERF] Invalida cache de inventário imediatamente
    updateTag("inventory");
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

export async function deleteProductAction(id: string) {
  try {
    // Verifica se o produto tem itens de pedido associados
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      return { 
        error: "Este produto não pode ser excluído permanentemente porque possui histórico de vendas. Recomendamos que você apenas o oculte do catálogo." 
      };
    }

    await prisma.product.delete({
      where: { id }
    });

    // ✅ [PERF] Invalida cache de inventário imediatamente
    updateTag("inventory");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return { error: "Não foi possível excluir o produto. Tente novamente mais tarde." };
  }
}

/**
 * [BULK] Altera o status (ativo/oculto) de múltiplos produtos de uma vez.
 */
export async function bulkToggleStatusAction(ids: string[], active: boolean) {
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { active },
    });

    updateTag("inventory");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Erro ao atualizar status em massa:", error);
    return { error: "Não foi possível atualizar os produtos. Tente novamente." };
  }
}

/**
 * [BULK] Exclui múltiplos produtos de uma vez.
 * Protege contra exclusão de produtos com histórico de vendas.
 */
export async function bulkDeleteAction(ids: string[]) {
  try {
    // Check if any have order history
    const withOrders = await prisma.orderItem.findMany({
      where: { productId: { in: ids } },
      select: { productId: true },
      distinct: ["productId"],
    });

    const blockedIds = new Set(withOrders.map((o) => o.productId));
    const deletableIds = ids.filter((id) => !blockedIds.has(id));

    if (deletableIds.length > 0) {
      await prisma.product.deleteMany({
        where: { id: { in: deletableIds } },
      });

      updateTag("inventory");
      revalidatePath("/admin/products");
      revalidatePath("/");
    }

    return {
      success: true,
      deleted: deletableIds.length,
      blocked: blockedIds.size,
    };
  } catch (error) {
    console.error("Erro ao excluir produtos em massa:", error);
    return { error: "Não foi possível excluir os produtos. Tente novamente." };
  }
}
