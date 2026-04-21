"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Archive } from "lucide-react";

interface NewsletterTabsProps {
  activeCount: number;
  archivedCount: number;
}

export function NewsletterTabs({ activeCount, archivedCount }: NewsletterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "active";

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "active") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
      <button
        onClick={() => setTab("active")}
        className={cn(
          "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
          currentTab === "active"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        Ativos ({activeCount})
      </button>
      <button
        onClick={() => setTab("archived")}
        className={cn(
          "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
          currentTab === "archived"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        <Archive className="h-4 w-4" />
        Arquivados ({archivedCount})
      </button>
    </div>
  );
}
