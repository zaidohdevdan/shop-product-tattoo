"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ActiveFiltersProps {
  categories: CategoryOption[];
}

export function ActiveFilters({ categories }: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const stock = searchParams.get("stock");
  const categoryId = searchParams.get("categoryId");

  const hasFilters = search || (status && status !== "all") || (stock && stock !== "all") || (categoryId && categoryId !== "all");

  if (!hasFilters) return null;

  const removeFilter = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    params.delete("page");
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const statusMap: Record<string, string> = {
    active: "Ativos",
    hidden: "Ocultos",
  };

  const stockMap: Record<string, string> = {
    in_stock: "Em Estoque",
    out_of_stock: "Esgotados",
  };

  return (
    <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-500">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Filtros:</span>
      
      {search && (
        <Badge label={`Busca: ${search}`} onRemove={() => removeFilter("search")} />
      )}
      
      {categoryId && categoryId !== "all" && (
        <Badge label={`Cat: ${getCategoryName(categoryId)}`} onRemove={() => removeFilter("categoryId")} />
      )}
      
      {status && status !== "all" && (
        <Badge label={`Status: ${statusMap[status] || status}`} onRemove={() => removeFilter("status")} />
      )}
      
      {stock && stock !== "all" && (
        <Badge label={`Estoque: ${stockMap[stock] || stock}`} onRemove={() => removeFilter("stock")} />
      )}

      <button
        onClick={clearAll}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-tight hover:bg-rose-100 transition-colors ml-2"
      >
        <RotateCcw className="h-3 w-3" />
        Limpar Tudo
      </button>
    </div>
  );
}

function Badge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-tight">
      {label}
      <button 
        onClick={onRemove}
        className="hover:text-indigo-900 transition-colors"
        title="Remover filtro"
      >
        <X className="h-3 w-3 transition-transform active:scale-75" />
      </button>
    </div>
  );
}
