"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export async function saveCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  // Slug generator handling accents cleanly
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  if (!name || name.trim() === "") return;

  await prisma.category.create({
    data: { name, slug }
  });

  // ✅ [PERF] Invalida cache de inventário (queries de produtos incluem categoria)
  updateTag("inventory");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get("id") as string;
  const productCount = Number(formData.get("productCount"));

  if (productCount > 0) {
    // Protege contra quebra de Foreign Key Constraints de DB Relacional
    throw new Error("Impossível deletar: Categoria possui produtos vinculados. Você deve mover ou deletar os produtos dela.");
  }

  await prisma.category.delete({
    where: { id }
  });

  // ✅ [PERF] Invalida cache de inventário
  updateTag("inventory");
  revalidatePath("/admin/categories");
}
