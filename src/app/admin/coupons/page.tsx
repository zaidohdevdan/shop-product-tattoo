import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/admin/Sidebar";
import { Ticket } from "lucide-react";
import { CouponsClientPage } from "./CouponsClientPage";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedCoupons = coupons.map(c => ({
    ...c,
    discountValue: Number(c.discountValue),
  }));

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Ticket className="h-5 w-5 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                Gerenciar <span className="text-indigo-400">Cupons</span>
              </h1>
            </div>
            <p className="text-zinc-500 font-medium">
              Crie códigos de desconto para fidelizar seus clientes e aumentar as vendas.
            </p>
          </div>
        </header>

        <CouponsClientPage initialCoupons={formattedCoupons} />
      </main>
    </div>
  );
}
