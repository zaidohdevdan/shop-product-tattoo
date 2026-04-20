import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderConfirmationForm } from "./OrderConfirmationForm";
import { Header } from "@/components/shared/Header";
import { ShoppingBag } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ConfirmOrderPage({ params }: PageProps) {
  const { token } = await params;

  // Buscar o pedido pelo token
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

  if (!order) {
    notFound();
  }

  const formattedItems = order.items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: Number(item.price)
  }));

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <Header />
      
      <main className="flex-1 w-full max-w-2xl px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 mb-6 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <ShoppingBag className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-5xl">
            Confirmar <br /> <span className="text-indigo-400">Venda</span>
          </h1>
          <p className="mt-4 text-zinc-500 font-medium">
            Verifique os itens abaixo e confirme se o produto foi vendido ou se o cliente desistiu do pedido.
          </p>
        </div>

        <OrderConfirmationForm 
          token={token}
          customerName={order.customerName}
          totalPrice={Number(order.totalPrice)}
          items={formattedItems}
          status={order.status}
        />
      </main>

      {/* Decorative background elements matching the shop aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>
    </div>
  );
}
