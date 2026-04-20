"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function createOrderAction(customerName: string, items: { id: string, quantity: number, price: number }[]) {
  try {
    // 1. Validar estoque de todos os itens no servidor
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true }
      });

      if (!product || product.stock < item.quantity) {
        return { 
          error: `Estoque insuficiente para o produto: ${product?.name || "Desconhecido"}. Disponível: ${product?.stock || 0}` 
        };
      }
    }

    // 2. Calcular total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. Criar o pedido (Status PENDING por padrão)
    const order = await prisma.order.create({
      data: {
        customerName,
        totalPrice: total,
        status: OrderStatus.PENDING,
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      select: {
        id: true,
        sellerToken: true
      }
    });

    return { success: true, orderId: order.id, sellerToken: order.sellerToken };
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return { error: "Ocorreu um erro ao processar seu pedido. Tente novamente." };
  }
}

export async function confirmOrderAction(token: string, confirmed: boolean) {
  try {
    const order = await prisma.order.findUnique({
      where: { sellerToken: token },
      include: { items: true }
    });

    if (!order) {
      return { error: "Pedido não encontrado ou link inválido." };
    }

    if (order.status !== OrderStatus.PENDING) {
      return { error: `Este pedido já foi processado como: ${order.status}` };
    }

    if (confirmed) {
      // 1. Verificar estoque final antes de descontar (prevenir overselling de última hora)
      for (const item of order.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true }
        });

        if (!product || product.stock < item.quantity) {
          return { error: "Não há estoque suficiente para confirmar esta venda no momento." };
        }
      }

      // 2. Realizar a transação atômica: Atualizar status e baixar estoque
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CONFIRMED }
        }),
        ...order.items.map(item => 
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        )
      ]);

      revalidatePath("/admin/products");
      revalidatePath("/admin/inventory"); // Assumindo que pode existir
      revalidatePath("/");
      
      return { success: true, message: "Venda confirmada e estoque atualizado!" };
    } else {
      // Registrar que não foi vendido (apenas cancela o pedido)
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED }
      });

      return { success: true, message: "Pedido cancelado. O estoque não foi alterado." };
    }
  } catch (error) {
    console.error("Erro ao confirmar pedido:", error);
    return { error: "Erro interno no servidor ao processar a confirmação." };
  }
}
