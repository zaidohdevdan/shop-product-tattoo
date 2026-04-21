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
      <header className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gestão de Promocionais</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Configuração de Cupons e Descontos</p>
        </div>
      </header>

      <div className="animate-in fade-in zoom-in-95 duration-700">
        <CouponsClientPage initialCoupons={formattedCoupons} />
      </div>
    </div>
  );
}
