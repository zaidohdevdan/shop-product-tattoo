import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react";
import { DashboardMetrics } from "@/services/sales-service";

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
      border: "border-emerald-500/10",
    },
    {
      label: "Total de Pedidos",
      value: current.orders,
      growth: calculateGrowth(current.orders, previous.orders),
      icon: <ShoppingBag className="h-5 w-5 text-indigo-400" />,
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/10",
    },
    {
      label: "Ticket Médio",
      value: `R$ ${current.avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      growth: calculateGrowth(current.avgTicket, previous.avgTicket),
      icon: <TrendingUp className="h-5 w-5 text-violet-400" />,
      bg: "bg-violet-500/10",
      border: "border-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className={`p-6 rounded-[2rem] border ${stat.border} bg-zinc-950 flex flex-col gap-4 shadow-xl relative overflow-hidden`}
        >
          {/* Subtle Accent */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-3xl -translate-y-16 translate-x-16 pointer-events-none`} />
          
          <div className="flex justify-between items-start">
            <div className={`h-10 w-10 rounded-xl ${stat.bg} border border-white/5 flex items-center justify-center`}>
              {stat.icon}
            </div>
            {stat.growth !== null ? (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                stat.growth >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
              }`}>
                {stat.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(stat.growth).toFixed(1)}%
              </div>
            ) : (
              <div className="text-[9px] font-black uppercase tracking-tight text-zinc-600 bg-white/5 px-2 py-1 rounded-lg">
                Sem dados anteriores
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-white mt-1.5 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
