"use client";

import { useState, useCallback } from "react";
import { BulkActionsBar } from "./BulkActionsBar";
import { cn } from "@/lib/utils";

interface ProductRowData {
  id: string;
}

interface ProductTableClientProps {
  products: ProductRowData[];
  children: (args: {
    selectedIds: Set<string>;
    toggleOne: (id: string) => void;
    isAllSelected: boolean;
    toggleAll: () => void;
  }) => React.ReactNode;
}

export function ProductTableClient({ products, children }: ProductTableClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === products.length
        ? new Set()
        : new Set(products.map((p) => p.id))
    );
  }, [products]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const isAllSelected = products.length > 0 && selectedIds.size === products.length;

  return (
    <>
      {children({ selectedIds, toggleOne, isAllSelected, toggleAll })}
      <BulkActionsBar
        selectedIds={Array.from(selectedIds)}
        onClearSelection={clearSelection}
      />
    </>
  );
}

// Re-usable checkbox cell for table rows
export function RowCheckbox({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <td className="pl-5 pr-2 py-6">
      <label
        className="flex items-center justify-center cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(id)}
          className="sr-only peer"
        />
        <div
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-1",
            checked
              ? "bg-indigo-600 border-indigo-600"
              : "border-slate-300 hover:border-indigo-400 bg-white"
          )}
        >
          {checked && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </label>
    </td>
  );
}
