"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Ban, CheckCircle2, Box, Filter, SortAsc } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FilterSelect } from "./FilterSelect";
import { useDebounce } from "../../hooks/use-debounce";
import { ActiveFilters } from "./ActiveFilters";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "" || value === "newest") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reset page when filtering
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = useCallback((name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  }, [pathname, router, createQueryString]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      handleFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, handleFilter, searchParams]);

  const currentStatus = searchParams.get("status") || "all";
  const currentStock = searchParams.get("stock") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("categoryId") || "all";

  const sortOptions = [
    { value: "newest", label: "Mais Recentes" },
    { value: "price_asc", label: "Menor Preço" },
    { value: "price_desc", label: "Maior Preço" },
    { value: "stock_asc", label: "Menor Estoque" },
    { value: "stock_desc", label: "Maior Estoque" },
    { value: "popular", label: "Mais Vendidos" },
    { value: "name_asc", label: "Nome (A-Z)" },
  ];

  const categoryOptions = [
    { value: "all", label: "Todas Categorias" },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 items-stretch xl:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou SKU..."
            className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
          />
        </div>

        {/* Dynamic Selects */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <FilterSelect 
            value={currentCategory} 
            onValueChange={(val) => handleFilter("categoryId", val)}
            options={categoryOptions}
            placeholder="Categoria"
            icon={<Filter className="h-3.5 w-3.5" />}
          />
          <FilterSelect 
            value={currentSort} 
            onValueChange={(val) => handleFilter("sort", val)}
            options={sortOptions}
            placeholder="Ordenação"
            icon={<SortAsc className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Toggles Container */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {/* Status Filter */}
        <div className="flex w-full sm:w-auto bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            title="Filtrar por Todos os Status"
            onClick={() => handleFilter("status", "all")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
              currentStatus === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Todos
          </button>
          <button
            type="button"
            title="Exibir apenas produtos Ativos"
            onClick={() => handleFilter("status", "active")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStatus === "active" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Ativos
          </button>
          <button
            type="button"
            title="Exibir apenas produtos Ocultos"
            onClick={() => handleFilter("status", "hidden")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStatus === "hidden" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Ban className="h-3 w-3" />
            Ocultos
          </button>
        </div>

        {/* Stock Filter */}
        <div className="flex w-full sm:w-auto bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button
            type="button"
            title="Ver todos os tipos de estoque"
            onClick={() => handleFilter("stock", "all")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
              currentStock === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Estoque
          </button>
          <button
            type="button"
            title="Exibir apenas itens com Saldo"
            onClick={() => handleFilter("stock", "in_stock")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStock === "in_stock" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Box className="h-3 w-3" />
            Saldo
          </button>
          <button
            type="button"
            title="Exibir apenas itens Esgotados"
            onClick={() => handleFilter("stock", "out_of_stock")}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStock === "out_of_stock" ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Box className="h-3 w-3" />
            Acabou
          </button>
        </div>
      </div>

      {/* Active Filter Badges */}
      <ActiveFilters categories={categories} />
    </div>
  );
}
