"use client";

import React, { useCallback, useState } from "react";
import { Search, Ban, CheckCircle2, Box } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
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

  const handleFilter = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilter("search", search);
  };

  const currentStatus = searchParams.get("status") || "active";
  const currentStock = searchParams.get("stock") || "all";

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full lg:flex-1">
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
      </form>

      {/* Toggles Container */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        {/* Status Filter */}
        <div className="flex w-full sm:w-auto bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => handleFilter("status", "all")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              currentStatus === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilter("status", "active")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStatus === "active" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Ativos
          </button>
          <button
            onClick={() => handleFilter("status", "hidden")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
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
            onClick={() => handleFilter("stock", "all")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              currentStock === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Estoque
          </button>
          <button
            onClick={() => handleFilter("stock", "in_stock")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStock === "in_stock" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Box className="h-3 w-3" />
            Saldo
          </button>
          <button
            onClick={() => handleFilter("stock", "out_of_stock")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              currentStock === "out_of_stock" ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Box className="h-3 w-3" />
            Acabou
          </button>
        </div>
      </div>
    </div>
  );
}
