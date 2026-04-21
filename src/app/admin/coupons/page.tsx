import { prisma } from "@/lib/prisma";
import { CouponsClientPage } from "./CouponsClientPage";
import { Suspense } from "react";

async function CouponsDashboardContent() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedCoupons = coupons.map(c => ({
    ...c,
    discountValue: Number(c.discountValue),
  }));

  return <CouponsClientPage initialCoupons={formattedCoupons} />;
}

function CouponsSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-white rounded-2xl border border-slate-100" />
        <div className="h-12 w-32 bg-white rounded-2xl border border-slate-100" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-white rounded-[2rem] border border-slate-100 shadow-sm" />
        ))}
      </div>
    </div>
  );
}

export default async function AdminCouponsPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-500/30">
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
        <Suspense fallback={<CouponsSkeleton />}>
          <CouponsDashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
