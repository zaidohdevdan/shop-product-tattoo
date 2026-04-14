import { prisma } from "@/lib/prisma";

export interface ProductFilters {
  categoria?: string;
  search?: string;
  includeInactive?: boolean;
}

export const productService = {
  /**
   * Retorna a lista de produtos com base nos filtros (ex: categoria, busca textual)
   */
  async getProducts(filters: ProductFilters = {}) {
    const { categoria, search, includeInactive } = filters;

    return prisma.product.findMany({
      where: {
        AND: [
          includeInactive ? {} : { active: true },
          categoria ? { category: { slug: categoria } } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                  { sku: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Retorna um único produto pelo slug
   */
  async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, active: true },
      include: { category: true },
    });
  },

  /**
   * Retorna produtos relacionados (mesma categoria, excluindo o atual)
   */
  async getRelatedProducts(categoryId: string, excludeProductId: string, take = 4) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        active: true,
      },
      take,
      include: { category: true },
    });
  },

  /**
   * Retorna os produtos em destaque
   */
  async getFeaturedProducts(take = 4) {
    return prisma.product.findMany({
      where: { active: true },
      take,
      include: { category: true },
      orderBy: { createdAt: "desc" }, // Pode ser alterado para um campo 'featured' se adicionado ao schema
    });
  },
};
