"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategorySalesChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#3b82f6", // blue-500
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#64748b", // slate-500
];

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="premium-card p-8 flex flex-col items-center justify-center h-[320px] text-center border-dashed border-2">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sem dados de categorias</span>
      </div>
    );
  }

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="premium-card p-6 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Mix de Vendas</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Distribuição por Categoria</p>
        </div>
        <div className="bg-indigo-50 px-3 py-1 rounded-full">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">
            Total: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={0}
                  className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const percent = ((Number(item.value) / totalValue) * 100).toFixed(1);
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">R$ {Number(item.value).toLocaleString('pt-BR')}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">({percent}%)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value: string) => (
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text for Donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+10px)] pointer-events-none text-center">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita</span>
            <span className="block text-xl font-black text-slate-900 tracking-tighter">100%</span>
        </div>
      </div>
    </div>
  );
}
