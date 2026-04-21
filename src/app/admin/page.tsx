import React from "react";
import { productService } from "@/services/product-service";
import { Package } from "lucide-react";
import { DashboardRefresher } from "@/components/admin/DashboardRefresher";
import { salesService, TimeRange } from "@/services/sales-service";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentSales } from "@/components/admin/RecentSales";
import { CriticalStockCard } from "@/components/admin/CriticalStockCard";
import { InventoryValuation } from "@/components/admin/InventoryValuation";

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
  const outOfStockProducts = products.filter(p => p.stock === 0);
  
  // Fetch Inventory Valuation
  const valuationData = await productService.getInventoryValuation();
  

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardRefresher />
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Cockpit de Vendas</h1>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Visão Geral do Seu Negócio</p>
        </div>
        <DateRangePicker />
      </div>
      
      {/* Sales Metrics */}
      <DashboardStats metrics={metrics} />

      {/* Inventory Financial Valuation */}
      <InventoryValuation data={valuationData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-8 flex flex-col gap-6 group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 transition-all duration-500 group-hover:scale-110">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Produtos Gerenciados</h3>
              <p className="text-3xl font-black text-zinc-900 mt-2 tracking-tighter">{totalProducts}</p>
            </div>
          </div>

          <CriticalStockCard 
            outOfStockProducts={outOfStockProducts.map(p => ({ 
              id: p.id, 
              name: p.name, 
              stock: p.stock,
              sku: p.sku,
              images: p.images
            }))} 
          />
        </div>

        {/* Recent Sales Column */}
        <div className="lg:col-span-2">
          <RecentSales orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
