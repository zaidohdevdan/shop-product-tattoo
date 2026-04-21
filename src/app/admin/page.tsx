import React, { Suspense } from "react";
import { DashboardRefresher } from "@/components/admin/DashboardRefresher";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { TimeRange } from "@/services/sales-service";
import {
  DashboardStatsSection,
  SalesTrendSection,
  InventoryValuationSection,
  RecentSalesSection,
  InventoryOverviewSection,
  CategorySalesSection,
} from "@/components/admin/DashboardSections";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

// ✅ [PERF] Skeleton reutilizável para seções em carregamento
function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`premium-card animate-pulse bg-slate-100/50 ${className}`} />
  );
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const { range = "week" } = await searchParams;
  const typedRange = range as TimeRange;

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardRefresher />

      {/* Header & Filter — Renderizado imediatamente, sem esperar dados */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Cockpit de Vendas</h1>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Visão Geral do Seu Negócio</p>
        </div>
        <DateRangePicker />
      </div>

      {/* ✅ [PERF] Top Section — Chart e Valoração em Suspense paralelos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<CardSkeleton className="h-[500px]" />}>
            <SalesTrendSection range={typedRange} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<CardSkeleton className="h-[500px]" />}>
            <InventoryValuationSection />
          </Suspense>
        </div>
      </div>

      {/* ✅ [PERF] Métricas de Vendas em Suspense */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} className="h-36" />)}
        </div>
      }>
        <DashboardStatsSection range={typedRange} />
      </Suspense>

      {/* ✅ [PERF] Inventário, Categorias e Vendas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Suspense fallback={<div className="space-y-6"><CardSkeleton className="h-40" /><CardSkeleton className="h-64" /></div>}>
            <InventoryOverviewSection />
          </Suspense>
          
          <Suspense fallback={<CardSkeleton className="h-80" />}>
            <CategorySalesSection range={typedRange} />
          </Suspense>
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<CardSkeleton className="h-[730px]" />}>
            <RecentSalesSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
