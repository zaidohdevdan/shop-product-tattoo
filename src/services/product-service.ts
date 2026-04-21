import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheTag } from "next/cache";

export interface ProductFilters {
  categoria?: string; // slug
  categoryId?: string; // ID
  search?: string;
  status?: 'active' | 'hidden' | 'all';
  stock?: 'in_stock' | 'out_of_stock' | 'all';
  sort?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  /**
   * Retorna a lista de produtos com base nos filtros e paginação
   */
  async getProducts(filters: ProductFilters = {}) {
    "use cache";
    cacheTag("inventory");
    const { categoria, categoryId, search, status = 'all', stock = 'all', sort = 'newest', page = 1, limit = 8 } = filters;
    const skip = (page - 1) * limit;

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (categoria) {
      andConditions.push({ category: { slug: categoria } });
    }

    if (categoryId) {
      andConditions.push({ categoryId });
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

    // Definir Ordenação
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "stock_asc") orderBy = { stock: "asc" };
    else if (sort === "stock_desc") orderBy = { stock: "desc" };
    else if (sort === "popular") orderBy = { orderItems: { _count: "desc" } };
    else if (sort === "name_asc") orderBy = { name: "asc" };

    const products = await prisma.product.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      price: Number(p.price),
      costPrice: Number(p.costPrice),
      active: p.active,
      categoryId: p.categoryId,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      } : null
    }));
  },

  /**
   * Retorna a contagem total de produtos para paginação
   */
  async getProductsCount(filters: ProductFilters = {}) {
    const { categoria, categoryId, search, status = 'all', stock = 'all' } = filters;

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (categoria) {
      andConditions.push({ category: { slug: categoria } });
    }

    if (categoryId) {
      andConditions.push({ categoryId });
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
    "use cache";
    cacheTag("inventory");
    const p = await prisma.product.findUnique({
      where: { slug, active: true },
      include: { category: true },
    });

    if (!p) return null;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      price: Number(p.price),
      costPrice: Number(p.costPrice),
      active: p.active,
      categoryId: p.categoryId,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      } : null
    };
  },

  /**
   * Retorna produtos relacionados (mesma categoria, excluindo o atual)
   */
  async getRelatedProducts(categoryId: string, excludeProductId: string, take = 4) {
    "use cache";
    cacheTag("inventory");
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        active: true,
      },
      take,
      include: { category: true },
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      price: Number(p.price),
      costPrice: Number(p.costPrice),
      active: p.active,
      categoryId: p.categoryId,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      } : null
    }));
  },

  /**
   * Retorna os produtos em destaque
   */
  async getFeaturedProducts(take = 4) {
    "use cache";
    cacheTag("inventory");
    const products = await prisma.product.findMany({
      where: { active: true },
      take,
      include: { category: true },
      orderBy: { createdAt: "desc" }, // Pode ser alterado para um campo 'featured' se adicionado ao schema
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      price: Number(p.price),
      costPrice: Number(p.costPrice),
      active: p.active,
      categoryId: p.categoryId,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      } : null
    }));
  },

  /**
   * Retorna a valoração do estoque atual (Custo vs. Venda)
   */
  async getInventoryValuation() {
    "use cache";
    cacheTag("inventory");

    const products = await prisma.product.findMany({
      select: {
        stock: true,
        price: true,
        costPrice: true,
      },
    });

    let totalCost = 0;
    let potentialRevenue = 0;
    let missingCostCount = 0;

    products.forEach((p) => {
      const cost = Number(p.costPrice);
      if (p.stock > 0 && cost === 0) {
        missingCostCount++;
      }
      totalCost += p.stock * cost;
      potentialRevenue += p.stock * Number(p.price);
    });

    const totalMargin = potentialRevenue - totalCost;
    const marginPercentage = potentialRevenue > 0 ? (totalMargin / potentialRevenue) * 100 : 0;

    return {
      totalCost,
      potentialRevenue,
      totalMargin,
      marginPercentage,
      missingCostCount,
    };
},

  /**
   * [PERF] Retorna apenas a contagem total de produtos ativos.
   * Mais eficiente que getProducts() para o dashboard.
   */
  async getTotalProductCount(): Promise<number> {
    "use cache";
    cacheTag("inventory");
    return prisma.product.count();
  },

  /**
   * [PERF] Retorna apenas os produtos esgotados com os campos mínimos necessários.
   * Mais eficiente que filtrar no JS após buscar todos os produtos.
   */
  async getOutOfStockProducts() {
    "use cache";
    cacheTag("inventory");
    return prisma.product.findMany({
      where: { stock: 0 },
      select: {
        id: true,
        name: true,
        stock: true,
        sku: true,
        images: true,
      },
    });
  },
};
