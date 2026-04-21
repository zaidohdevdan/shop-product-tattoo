import { prisma } from "@/lib/prisma";

export const categoryService = {
  /**
   * Retorna categorias com suporte a paginação
   */
  async getAllCategories(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
    });
  },

  /**
   * Retorna a contagem total de categorias
   */
  async getCategoriesCount() {
    return prisma.category.count();
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
