import { salesService, TimeRange } from "@/services/sales-service";
import { productService } from "@/services/product-service";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { SalesTrendChart } from "@/components/admin/SalesTrendChart";
import { InventoryValuation } from "@/components/admin/InventoryValuation";
import { RecentSales } from "@/components/admin/RecentSales";
import { CriticalStockCard } from "@/components/admin/CriticalStockCard";
import { CategorySalesChart } from "@/components/admin/CategorySalesChart";
import { Package } from "lucide-react";

// ---------------------------------------------------------------------------
// Sub-components async: cada um faz seu próprio fetch em paralelo com o Suspense
// ---------------------------------------------------------------------------

interface SectionProps {
  rangePromise: Promise<{ range?: string }>;
}

export async function DashboardStatsSection({ rangePromise }: SectionProps) {
  const resolvedParams = await rangePromise;
  const range = (resolvedParams?.range as TimeRange) || "week";
  const metrics = await salesService.getDashboardStats(range);
  return <DashboardStats metrics={metrics} />;
}

export async function SalesTrendSection({ rangePromise }: SectionProps) {
  const resolvedParams = await rangePromise;
  const range = (resolvedParams?.range as TimeRange) || "week";
  const trendData = await salesService.getSalesTrendData(range);
  return <SalesTrendChart data={trendData} />;
}

export async function InventoryValuationSection() {
  const valuationData = await productService.getInventoryValuation();
  return <InventoryValuation data={valuationData} />;
}

export async function RecentSalesSection() {
  const recentOrders = await salesService.getRecentOrders(5);
  return <RecentSales orders={recentOrders} />;
}

export async function InventoryOverviewSection() {
  const [totalProducts, outOfStockProducts] = await Promise.all([
    productService.getTotalProductCount(),
    productService.getOutOfStockProducts(),
  ]);

  return (
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
      <CriticalStockCard outOfStockProducts={outOfStockProducts} />
    </div>
  );
}

export async function CategorySalesSection({ rangePromise }: SectionProps) {
  const resolvedParams = await rangePromise;
  const range = (resolvedParams?.range as TimeRange) || "week";
  const categoryData = await salesService.getSalesByCategory(range);
  return <CategorySalesChart data={categoryData} />;
}
