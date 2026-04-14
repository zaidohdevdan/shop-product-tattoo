"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleProductStatusAction(productId: string, currentStatus: boolean) {
  await prisma.product.update({
    where: { id: productId },
    data: { active: !currentStatus },
  });
  
  // Limpa o cache para todas as rotas relevantes para exibir a mudança instantaneamente
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function saveProductAction(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  
  // URLs divididas por vírgula como simplificação para o MVP
  const imagesStr = formData.get("images") as string;
  const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];

  // Geração automatizada de slug amigável
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  if (id) {
    await prisma.product.update({
      where: { id },
      data: { name, slug, sku, price, stock, description, categoryId, images },
    });
  } else {
    // Para Create, a propriedade active vem true por default do banco, garantimos mesmo assim
    await prisma.product.create({
      data: { name, slug, sku, price, stock, description, categoryId, images, active: true },
    });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
