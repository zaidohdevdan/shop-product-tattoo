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
    <div className="flex flex-wrap gap-2 mb-8 bg-slate-200/40 p-1.5 rounded-2xl border border-slate-200 w-fit">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleRangeChange(range.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            currentRange === range.value
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
