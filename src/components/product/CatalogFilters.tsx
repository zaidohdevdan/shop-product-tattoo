"use client";

import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowDownNarrowWide, ArrowUpNarrowWide, Clock } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  activeSlug?: string;
  activeSort?: string;
  search?: string;
}

const sortOptions = [
  { value: "newest", label: "Novidades", icon: Clock },
  { value: "price_asc", label: "Menor Preço", icon: ArrowDownNarrowWide },
  { value: "price_desc", label: "Maior Preço", icon: ArrowUpNarrowWide },
  { value: "name_asc", label: "Nome A-Z", icon: ArrowDownAZ },
];

export function CatalogFilters({ categories, activeSlug, activeSort, search }: CatalogFiltersProps) {
  const getHref = (cat?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("categoria", cat);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (search) params.set("search", search);
    
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Categorias</h4>
        <div className="flex flex-wrap gap-2">
          <Link
            href={getHref(undefined, activeSort)}
            className={cn(
              "rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200",
              !activeSlug
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]"
                : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-white"
            )}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={getHref(cat.slug, activeSort)}
              className={cn(
                "rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200",
                activeSlug === cat.slug
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]"
                  : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-white"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ordenar por</h4>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeSort === opt.value || (!activeSort && opt.value === "newest");
            return (
              <Link
                key={opt.value}
                href={getHref(activeSlug, opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-black uppercase tracking-tight transition-all duration-200",
                  isActive
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]"
                    : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
