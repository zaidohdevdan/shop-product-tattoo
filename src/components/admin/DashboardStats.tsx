import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react";
import { DashboardMetrics } from "@/services/sales-service";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  metrics: DashboardMetrics;
}

export function DashboardStats({ metrics }: DashboardStatsProps) {
  const { current, previous } = metrics;

  const calculateGrowth = (curr: number, prev: number) => {
    if (prev === 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  const stats = [
    {
      label: "Faturamento Total",
      value: `R$ ${current.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      growth: calculateGrowth(current.revenue, previous.revenue),
      icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
      bg: "bg-emerald-500/10",
    },
    {
      label: "Lucro Bruto",
      value: `R$ ${current.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      growth: calculateGrowth(current.profit, previous.profit),
      icon: <TrendingUp className="h-5 w-5 text-indigo-400" />,
      bg: "bg-indigo-500/10",
      extra: (
        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
          Margem: {current.profitMargin.toFixed(1)}%
        </span>
      )
    },
    {
      label: "Total de Pedidos",
      value: current.orders,
      growth: calculateGrowth(current.orders, previous.orders),
      icon: <ShoppingBag className="h-5 w-5 text-violet-400" />,
      bg: "bg-violet-500/10",
    },
    {
      label: "Ticket Médio",
      value: `R$ ${current.avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      growth: calculateGrowth(current.avgTicket, previous.avgTicket),
      icon: <TrendingUp className="h-5 w-5 text-amber-400" />,
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="premium-card p-8 flex flex-col gap-6 group"
        >
          <div className="flex justify-between items-start z-10">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
              stat.bg,
              "border border-white/[0.03]"
            )}>
              {stat.icon}
            </div>
            
            {stat.growth !== null ? (
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                stat.growth >= 0 
                  ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                  : "text-rose-700 bg-rose-50 border-rose-100"
              )}>
                {stat.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(stat.growth).toFixed(1)}%
              </div>
            ) : (
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                Initial
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              {stat.extra}
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
