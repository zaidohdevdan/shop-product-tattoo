"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  activeSlug?: string;
}

export function CatalogFilters({ categories, activeSlug }: CatalogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/products"
        className={cn(
          "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
          !activeSlug
            ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
            : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
        )}
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?categoria=${cat.slug}`}
          className={cn(
            "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
            activeSlug === cat.slug
              ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
