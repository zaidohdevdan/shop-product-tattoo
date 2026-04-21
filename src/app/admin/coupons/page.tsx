import { prisma } from "@/lib/prisma";
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-indigo-500/30">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Ticket className="h-5 w-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Gerenciar <span className="text-indigo-400">Cupons</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
            Crie códigos de desconto para fidelizar seus clientes e aumentar as vendas.
          </p>
        </div>
      </header>

      <div className="animate-in fade-in zoom-in-95 duration-700">
        <CouponsClientPage initialCoupons={formattedCoupons} />
      </div>
    </div>
  );
}
