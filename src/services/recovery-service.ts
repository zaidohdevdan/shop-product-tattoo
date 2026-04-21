import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { cacheTag } from "next/cache";

export interface AbandonedCartPlain {
  id: string;
  customerName: string;
  customerPhone: string | null;
  totalPrice: number;
  createdAt: Date;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

/**
 * Busca carrinhos abandonados com suporte a filtro de arquivamento e busca.
 */
export async function getAbandonedCarts(archived = false, search?: string): Promise<AbandonedCartPlain[]> {
  "use cache";
  cacheTag("orders");

  const where: Prisma.OrderWhereInput = {
    status: OrderStatus.PENDING,
    customerPhone: { not: null },
    isArchived: archived
  };

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search, mode: 'insensitive' } }
    ];
  }

  const carts = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return carts.map(cart => ({
    id: cart.id,
    customerName: cart.customerName,
    customerPhone: cart.customerPhone,
    totalPrice: Number(cart.totalPrice),
    createdAt: cart.createdAt,
    items: cart.items.map(item => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: Number(item.price)
    }))
  }));
}

/**
 * Gestão de leads de recuperação
 */
export async function archiveRecoveryOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { isArchived: true }
  });
}

export async function unarchiveRecoveryOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { isArchived: false }
  });
}

export async function deleteRecoveryOrder(id: string) {
  // O Prisma deleta em cascata os itens se configurado, 
  // mas aqui deletamos manualmente ou confiamos no schema (Order -> Items)
  return prisma.order.delete({
    where: { id }
  });
}

/**
 * Estatísticas globais de abandono (inclui arquivados)
 */
export async function getRecoveryStats() {
  const [active, archived, totalPotential] = await Promise.all([
    prisma.order.count({ where: { status: OrderStatus.PENDING, isArchived: false, customerPhone: { not: null } } }),
    prisma.order.count({ where: { status: OrderStatus.PENDING, isArchived: true, customerPhone: { not: null } } }),
    prisma.order.aggregate({
      where: { status: OrderStatus.PENDING, customerPhone: { not: null } },
      _sum: { totalPrice: true }
    })
  ]);

  return {
    activeCount: active,
    archivedCount: archived,
    totalCount: active + archived,
    potentialRevenue: Number(totalPotential._sum.totalPrice || 0)
  };
}

export const recoveryService = {
  getAbandonedCarts,
  archiveRecoveryOrder,
  unarchiveRecoveryOrder,
  deleteRecoveryOrder,
  getRecoveryStats
};
