import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

export interface OrderItemPlain {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderPlain {
  id: string;
  customerName: string;
  customerPhone: string | null;
  totalPrice: number;
  status: string;
  items: OrderItemPlain[];
}

/**
 * Busca um pedido pelo token do vendedor com cache do Next.js 16.
 */
export async function getOrderByToken(token: string): Promise<OrderPlain | null> {
  "use cache";
  cacheTag("orders");

  const order = await prisma.order.findUnique({
    where: { sellerToken: token },
    include: {
      items: {
        include: {
          product: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!order) return null;

  // Converter para objeto plano serializável (RSC safe)
  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    totalPrice: Number(order.totalPrice),
    status: order.status,
    items: order.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.price)
    }))
  };
}

export const orderService = {
  getOrderByToken
};
