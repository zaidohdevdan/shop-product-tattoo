"use client";

import React, { useEffect, useRef } from "react";
import { Wallet, TrendingUp, BarChart3, Info } from "lucide-react";

interface ValuationData {
  totalCost: number;
  potentialRevenue: number;
  totalMargin: number;
  marginPercentage: number;
}

interface InventoryValuationProps {
  data: ValuationData;
}

export function InventoryValuation({ data }: InventoryValuationProps) {
  const { totalCost, potentialRevenue, totalMargin, marginPercentage } = data;
  const costBarRef = useRef<HTMLDivElement>(null);
  const revenueBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maxValue = Math.max(totalCost, potentialRevenue);
    if (costBarRef.current) {
      const costWidth = (totalCost / maxValue) * 100;
      costBarRef.current.style.setProperty("--bar-width", `${costWidth}%`);
    }
    if (revenueBarRef.current) {
      const revenueWidth = (potentialRevenue / maxValue) * 100;
      revenueBarRef.current.style.setProperty("--bar-width", `${revenueWidth}%`);
    }
  }, [totalCost, potentialRevenue]);

  return (
    <div className="premium-card p-10 relative overflow-hidden group h-full flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-100/50 transition-colors duration-1000" />
      
      <div className="flex flex-col items-stretch justify-between gap-10 relative z-10 flex-1">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Valoração de Estoque</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Visão de ROI e Ativos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-indigo-100 hover:bg-white shadow-xs group/item">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="h-4 w-4 text-slate-400 group-hover/item:text-indigo-600 transition-colors" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capital Investido</span>
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tighter">
                R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 transition-all hover:bg-indigo-50 shadow-xs group/item">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-4 w-4 text-indigo-400 group-hover/item:text-indigo-600 transition-colors" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Faturamento Potencial</span>
              </div>
              <p className="text-xl font-black text-indigo-700 tracking-tighter">
                R$ {potentialRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-8 mt-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Comparação de Fluxo</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Custo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Venda</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                <div 
                  ref={costBarRef}
                  className="inventory-bar-fill inventory-bar-cost" 
                />
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                <div 
                  ref={revenueBarRef} 
                  className="inventory-bar-fill inventory-bar-revenue delay-300" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">Margem Líquida Estimada</p>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tighter whitespace-nowrap">
                  R$ {totalMargin.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 whitespace-nowrap text-center">
                    +{marginPercentage.toFixed(1)}% <span className="text-[8px] opacity-60">MARGEM</span>
                  </span>
                  {totalCost > 0 && (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 whitespace-nowrap text-center">
                      {((totalMargin / totalCost) * 100).toFixed(0)}% <span className="text-[8px] opacity-60">MARKUP (ROI)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 transition-colors cursor-help group/info" title="Cálculo baseado em Preço de Venda vs. Preço de Custo multiplicado pelo estoque total.">
              <Info className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
