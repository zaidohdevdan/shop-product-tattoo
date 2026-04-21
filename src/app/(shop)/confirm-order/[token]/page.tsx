import { notFound } from "next/navigation";
import { OrderConfirmationForm } from "./OrderConfirmationForm";
import { Header } from "@/components/shared/Header";
import { ShoppingBag } from "lucide-react";
import { orderService } from "@/services/order-service";
import { Suspense } from "react";
import { OrderStatus } from "@prisma/client";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function OrderDetails({ params }: { params: Promise<{ token: string }> }) {
  // No Next.js 16, aguardar params dentro do componente suspenso
  // garante que a 'casca' da página (Header/Layout) renderize instantaneamente.
  const { token } = await params;
  const order = await orderService.getOrderByToken(token);

  if (!order) {
    notFound();
  }

  return (
    <OrderConfirmationForm 
      token={token}
      customerName={order.customerName}
      customerPhone={order.customerPhone}
      totalPrice={order.totalPrice}
      items={order.items}
      status={order.status as OrderStatus}
    />
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
      <div className="flex gap-4">
        <div className="flex-1 h-16 bg-white/5 rounded-2xl border border-white/10" />
        <div className="flex-1 h-16 bg-white/5 rounded-2xl border border-white/10" />
      </div>
    </div>
  );
}

export default async function ConfirmOrderPage({ params }: PageProps) {
  // Importante: NÃO dar await em params aqui fora se quiser evitar o aviso "Blocking Route"
  // em rotas com Streaming habilitado por Suspense.

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

        <Suspense fallback={<OrderDetailsSkeleton />}>
          <OrderDetails params={params} />
        </Suspense>
      </main>

      {/* Decorative background elements matching the shop aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>
    </div>
  );
}
