"use client";

import { useState } from "react";
import { AlertTriangle, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  stock: number;
  sku: string;
  images: string[];
}

interface CriticalStockCardProps {
  outOfStockProducts: Product[];
}

export function CriticalStockCard({ outOfStockProducts }: CriticalStockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "premium-card p-8 flex flex-col gap-6 group cursor-pointer",
        isExpanded
          ? "border-rose-100 ring-2 ring-rose-500/5 bg-rose-50/20"
          : "hover:border-rose-200"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Estoque Crítico</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">Reposição Sugerida</p>
          </div>
        </div>
        <div className="executive-badge bg-rose-50 text-rose-700 border-rose-100 ring-2 ring-rose-500/5">
          {outOfStockProducts.length} ITENS
        </div>
      </div>

      <div className="space-y-4">
        {outOfStockProducts.slice(0, isExpanded ? undefined : 2).map((product) => (
          <div
            key={product.id}
            className="group p-4 bg-slate-50/30 rounded-xl border border-slate-100 hover:border-rose-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 relative rounded-lg border border-slate-200 overflow-hidden bg-white">
                  <Image
                    src={product.images[0] || "/placeholder-fallback.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKU: {product.sku}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-black text-rose-600 tracking-tighter">
                  {product.stock} <span className="text-[9px] uppercase font-bold">em estoque</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div
          className="mt-4 pt-6 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <PackageX className="h-3.5 w-3.5 text-rose-500 opacity-60" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventário Esgotado</p>
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
            {outOfStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-all">
                <span className="text-[10px] font-bold text-slate-700 truncate pr-4 uppercase tracking-tight">{p.name}</span>
                <span className="text-[8px] font-black bg-rose-50 text-rose-500 px-2.5 py-1 rounded-lg uppercase tracking-tighter border border-rose-100 shrink-0">Repor</span>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center mt-2 opacity-50">Toque aqui para fechar</p>
        </div>
      )}
    </div>
  );
}
