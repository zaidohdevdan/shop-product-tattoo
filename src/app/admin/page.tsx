import React from "react";
import { productService } from "@/services/product-service";
import { Package, AlertCircle, TrendingUp } from "lucide-react";
import { DashboardRefresher } from "@/components/admin/DashboardRefresher";
import { salesService, TimeRange } from "@/services/sales-service";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentSales } from "@/components/admin/RecentSales";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const { range = "week" } = await searchParams;
  
  // Fetch Sales Stats
  const metrics = await salesService.getDashboardStats(range as TimeRange);
  const recentOrders = await salesService.getRecentOrders(5);

  // Fetch Inventory Stats
  const products = await productService.getProducts({ includeInactive: true });
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const outOfStockCount = outOfStockProducts.length;
  

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <DashboardRefresher />
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Cockpit de Vendas</h1>
          <p className="text-sm font-black text-indigo-400/60 uppercase tracking-[0.3em] mt-2">Visão Geral do Seu Negócio</p>
        </div>
        <DateRangePicker />
      </div>
      
      {/* Sales Metrics */}
      <DashboardStats metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-[2.5rem] border border-white/5 bg-zinc-950 flex flex-col gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Produtos Ativos</h3>
              <p className="text-3xl font-black text-white mt-1">{totalProducts}</p>
            </div>
          </div>

          <div className="p-6 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 flex flex-col gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-red-500/70 uppercase tracking-widest">Estoque Crítico</h3>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-red-400">{lowStock + outOfStockCount}</p>
                  <span className="text-[9px] text-red-500/50 uppercase font-black tracking-widest">itens pendentes</span>
                </div>
                
                {outOfStockCount > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-red-500/10 pt-3">
                    <p className="text-[9px] font-black text-red-500/80 uppercase tracking-widest mb-1">Esgotados:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {outOfStockProducts.slice(0, 3).map(p => (
                        <span key={p.id} className="text-[9px] font-bold bg-red-500/20 text-red-200 px-2 py-0.5 rounded-md border border-red-500/20">
                          {p.name}
                        </span>
                      ))}
                      {outOfStockCount > 3 && (
                        <span className="text-[9px] font-bold text-red-500/50 italic">+ {outOfStockCount - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sales Column */}
        <div className="lg:col-span-2">
          <RecentSales orders={recentOrders} />
        </div>
      </div>
      
      {/* Footer / Architecture Note */}
      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:-translate-x-10 group-hover:opacity-10 transition-all duration-1000">
          <TrendingUp className="w-64 h-64 text-indigo-400" />
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Arquitetura de Dados Pro</h2>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-3xl font-medium">
          O Cockpit de Vendas utiliza agregação em tempo real diretamente do banco de dados, filtrando por períodos precisos. 
          As tendências de crescimento são calculadas comparando o intervalo selecionado com o período imediatamente anterior. 
          Sua interface é atualizada automaticamente a cada 30 segundos, mantendo você no controle total sem precisar de recargas manuais.
        </p>
      </div>
    </div>
  );
}
