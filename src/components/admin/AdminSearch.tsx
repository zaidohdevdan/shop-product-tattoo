"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function AdminSearch({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("query")?.toString() || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    const timeout = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className={`h-4 w-4 ${isPending ? "text-indigo-400 animate-pulse" : "text-slate-400"}`} />
      </div>
      <input
        type="text"
        className="block w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-[11px] font-bold uppercase tracking-tight text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          type="button"
          title="Limpar"
          onClick={() => setValue("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 group"
        >
          <X className="h-4 w-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
        </button>
      )}
    </div>
  );
}
