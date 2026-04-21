"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { TrendingUp, Calendar } from "lucide-react";


interface SalesTrendChartProps {
  data: {
    date: string;
    revenue: number;
    profit: number;
  }[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);


  return (
    <div className="premium-card p-10 space-y-8 group transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/5 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Evolução de Performance</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Faturamento vs Lucro Real</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo Real</span>
        </div>
      </div>

      <div className="h-[350px] min-h-[350px] w-full mt-4">
        {!hasMounted ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0} minHeight={0}>


          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px"
              }}
              itemStyle={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}
              labelStyle={{ fontSize: "10px", fontWeight: 900, marginBottom: "8px", color: "#64748b", textTransform: "uppercase" }}
              formatter={(value: ValueType | undefined  ) => {
                if (value === undefined || value === null) {
                  return ["", ""];
                }
                return [
                  `R$ ${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`,
                  "",
                ];
              }}
            />
            <Area
              name="Faturamento"
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              name="Lucro"
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume de Vendas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Margem Bruta Recalculada</span>
        </div>
      </div>
    </div>
  );
}
