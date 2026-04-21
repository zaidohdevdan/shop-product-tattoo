"use client";

import React from "react";
import { Download } from "lucide-react";

interface CSVEmailExportProps {
  data: { email: string; createdAt: Date | string }[];
}

export function CSVEmailExport({ data }: CSVEmailExportProps) {
  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = ["Email", "Data de Inscrição"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) => {
        const dateStr = typeof item.createdAt === "string" 
          ? item.createdAt 
          : item.createdAt.toISOString();
        return `${item.email},${dateStr}`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter_emails_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadCSV}
      disabled={data.length === 0}
      className="inline-flex h-11 items-center justify-center gap-3 rounded-2xl bg-white border border-slate-200 px-6 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </button>
  );
}
