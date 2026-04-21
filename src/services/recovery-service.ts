import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
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
 * Busca carrinhos abandonados (pedidos pendentes com telefone) com cache do Next.js 16.
 */
export async function getAbandonedCarts(): Promise<AbandonedCartPlain[]> {
  "use cache";
  cacheTag("orders");

  const carts = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      customerPhone: { not: null },
    },
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

export const recoveryService = {
  getAbandonedCarts
};
