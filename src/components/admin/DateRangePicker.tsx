"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { TimeRange } from "@/services/sales-service";

const ranges: { label: string; value: TimeRange }[] = [
  { label: "Dia", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Quinzena", value: "fortnight" },
  { label: "Mês", value: "month" },
  { label: "Trimestre", value: "quarter" },
  { label: "Semestre", value: "semester" },
  { label: "Ano", value: "year" },
];

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = (searchParams.get("range") as TimeRange) || "week";

  const handleRangeChange = (range: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleRangeChange(range.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            currentRange === range.value
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
