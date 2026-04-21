import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface ProductFilters {
  categoria?: string;
  search?: string;
  includeInactive?: boolean;
  status?: 'active' | 'hidden' | 'all';
  stock?: 'in_stock' | 'out_of_stock' | 'all';
  page?: number;
  limit?: number;
}

export const productService = {
  /**
   * Retorna a lista de produtos com base nos filtros e paginação
   */
  async getProducts(filters: ProductFilters = {}) {
    const { categoria, search, status = 'all', stock = 'all', page = 1, limit = 8 } = filters;
    const skip = (page - 1) * limit;

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (categoria) {
      andConditions.push({ category: { slug: categoria } });
    }

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Filtro de Status
    if (status === 'active') {
      andConditions.push({ active: true });
    } else if (status === 'hidden') {
      andConditions.push({ active: false });
    }

    // Filtro de Estoque
    if (stock === 'in_stock') {
      andConditions.push({ stock: { gt: 0 } });
    } else if (stock === 'out_of_stock') {
      andConditions.push({ stock: 0 });
    }

    return prisma.product.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
  },

  /**
   * Retorna a contagem total de produtos para paginação
   */
  async getProductsCount(filters: ProductFilters = {}) {
    const { categoria, search, status = 'all', stock = 'all' } = filters;

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (categoria) {
      andConditions.push({ category: { slug: categoria } });
    }

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (status === 'active') {
      andConditions.push({ active: true });
    } else if (status === 'hidden') {
      andConditions.push({ active: false });
    }

    if (stock === 'in_stock') {
      andConditions.push({ stock: { gt: 0 } });
    } else if (stock === 'out_of_stock') {
      andConditions.push({ stock: 0 });
    }

    return prisma.product.count({
      where: {
        AND: andConditions,
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

  /**
   * Calcula a valoração do estoque atual (Custo vs. Venda)
   */
  async getInventoryValuation() {
    const products = await prisma.product.findMany({
      select: {
        stock: true,
        price: true,
        costPrice: true,
      },
    });

    let totalCost = 0;
    let potentialRevenue = 0;

    products.forEach((p) => {
      totalCost += p.stock * Number(p.costPrice);
      potentialRevenue += p.stock * Number(p.price);
    });

    const totalMargin = potentialRevenue - totalCost;
    const marginPercentage = potentialRevenue > 0 ? (totalMargin / potentialRevenue) * 100 : 0;

    return {
      totalCost,
      potentialRevenue,
      totalMargin,
      marginPercentage,
    };
  },
};
