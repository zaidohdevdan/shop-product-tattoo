"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertCircle, Archive } from "lucide-react";

interface RecoveryTabsProps {
  activeCount: number;
  archivedCount: number;
}

export function RecoveryTabs({ activeCount, archivedCount }: RecoveryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "pending";

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "pending") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
      <button
        onClick={() => setTab("pending")}
        className={cn(
          "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
          currentTab === "pending"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        <AlertCircle className="h-4 w-4" />
        Aguardando ({activeCount})
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
