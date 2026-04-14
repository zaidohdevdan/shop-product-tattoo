import { prisma } from "@/lib/prisma";

export const categoryService = {
  /**
   * Retorna todas as categorias ordenadas por nome
   */
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * Retorna uma categoria pelo slug
   */
  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },
};
