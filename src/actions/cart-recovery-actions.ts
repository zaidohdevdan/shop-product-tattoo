"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/**
 * Sincroniza o estado do carrinho do cliente com o banco de dados.
 * Criado para capturar "Leads" e permitir a recuperação de carrinhos abandonados.
 */
export async function syncCartAction(
  customerName: string,
  customerPhone: string,
  items: { id: string; quantity: number; price: number }[]
) {
  if (!customerPhone || customerPhone.length < 10 || items.length === 0) {
    return { error: "Dados insuficientes para sincronização" };
  }

  try {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Tenta encontrar um pedido PENDING recente (últimas 2 horas) para este mesmo telefone
    // para atualizar em vez de criar múltiplos registros para a mesma sessão de compra.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const existingOrder = await prisma.order.findFirst({
      where: {
        customerPhone,
        status: OrderStatus.PENDING,
        createdAt: { gte: twoHoursAgo }
      },
      orderBy: { createdAt: "desc" }
    });

    if (existingOrder) {
      // Atualiza o pedido existente (limpa itens e recreia para simplificar a lógica de sync)
      await prisma.$transaction([
        prisma.orderItem.deleteMany({ where: { orderId: existingOrder.id } }),
        prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            customerName,
            totalPrice: subtotal,
            items: {
              create: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        }),
      ]);
      return { success: true, orderId: existingOrder.id, updated: true };
    } else {
      // Cria um novo registro de intenção de compra
      const newOrder = await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          totalPrice: subtotal,
          status: OrderStatus.PENDING,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      return { success: true, orderId: newOrder.id, updated: false };
    }
  } catch (error) {
    console.error("Erro ao sincronizar carrinho:", error);
    return { error: "Falha na sincronização do lead" };
  }
}
