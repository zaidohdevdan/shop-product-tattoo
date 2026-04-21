"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2, X, Loader2, CheckSquare } from "lucide-react";
import { bulkToggleStatusAction, bulkDeleteAction } from "@/actions/admin-products-actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const count = selectedIds.length;

  if (count === 0) return null;

  const handleActivate = () => {
    startTransition(async () => {
      const result = await bulkToggleStatusAction(selectedIds, true);
      if ("error" in result) {
        setFeedback(result.error ?? null);
      } else {
        setFeedback(`${result.count} produto(s) ativado(s).`);
        onClearSelection();
      }
    });
  };

  const handleHide = () => {
    startTransition(async () => {
      const result = await bulkToggleStatusAction(selectedIds, false);
      if ("error" in result) {
        setFeedback(result.error ?? null);
      } else {
        setFeedback(`${result.count} produto(s) ocultado(s).`);
        onClearSelection();
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja excluir ${count} produto(s)? Esta ação é irreversível.`)) return;
    startTransition(async () => {
      const result = await bulkDeleteAction(selectedIds);
      if ("error" in result) {
        setFeedback(result.error ?? null);
      } else {
        const msg = result.deleted > 0 ? `${result.deleted} excluído(s)` : "";
        const blocked = result.blocked > 0 ? `, ${result.blocked} protegido(s) por histórico de vendas` : "";
        setFeedback(`${msg}${blocked}.`);
        onClearSelection();
      }
    });
  };

  return (
    <div className={cn(
      "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
      "animate-in fade-in slide-in-from-bottom-4 duration-300"
    )}>
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 shadow-2xl shadow-slate-900/40 border border-slate-700">

        {/* Counter */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
          <CheckSquare className="h-4 w-4 text-indigo-400" />
          <span className="text-sm font-black text-white">
            {count} <span className="text-slate-400 font-bold">selecionado{count > 1 ? "s" : ""}</span>
          </span>
        </div>

        {/* Actions */}
        {isPending ? (
          <div className="flex items-center gap-2 px-4">
            <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
            <span className="text-sm text-slate-300 font-bold">Processando...</span>
          </div>
        ) : feedback ? (
          <div className="flex items-center gap-3 px-2">
            <span className="text-sm text-emerald-400 font-bold">{feedback}</span>
            <button
              title="Limpar feedback"
              type="button"
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleActivate}
              variant="admin"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 gap-2 h-9 border-none shadow-none px-3"
            >
              <Eye className="h-3.5 w-3.5" />
              Ativar
            </Button>
            <Button
              onClick={handleHide}
              variant="admin"
              size="sm"
              className="bg-slate-700 hover:bg-slate-600 gap-2 h-9 border-none shadow-none px-3"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Ocultar
            </Button>
            <Button
              onClick={handleDelete}
              variant="admin"
              size="sm"
              className="bg-rose-600 hover:bg-rose-500 gap-2 h-9 border-none shadow-none px-3"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </Button>
          </div>
        )}

        {/* Dismiss */}
        <button
          onClick={onClearSelection}
          className="ml-2 pl-4 border-l border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Limpar seleção"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
