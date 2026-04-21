"use client";

import React from "react";
import { Download } from "lucide-react";
import { AbandonedCartPlain } from "@/services/recovery-service";

interface RecoveryExportProps {
  data: AbandonedCartPlain[];
}

export function RecoveryExport({ data }: RecoveryExportProps) {
  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = ["ID", "Cliente", "Telefone", "Total", "Data", "Produtos"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) => {
        const dateStr = item.createdAt instanceof Date 
          ? item.createdAt.toISOString() 
          : new Date(item.createdAt).toISOString();
        
        const products = item.items.map(i => `${i.productName} (x${i.quantity})`).join(" | ");
        
        return [
          item.id,
          item.customerName,
          item.customerPhone || "",
          item.totalPrice.toFixed(2),
          dateStr,
          `"${products}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `recuperacao_leads_${new Date().toISOString().split('T')[0]}.csv`);
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
      Exportar Histórico
    </button>
  );
}
