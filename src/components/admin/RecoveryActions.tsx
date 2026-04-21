"use client";

import React, { useTransition } from "react";
import { Archive, Trash2, RotateCcw } from "lucide-react";
import { archiveRecoveryAction, unarchiveRecoveryAction, deleteRecoveryAction } from "@/actions/recovery-actions";
import { toast } from "sonner";

interface RecoveryActionsProps {
  id: string;
  isArchived: boolean;
}

export function RecoveryActions({ id, isArchived }: RecoveryActionsProps) {
  const [isPending, startTransition] = useTransition();

  const onArchive = () => {
    startTransition(async () => {
      const result = await archiveRecoveryAction(id);
      if (result.success) {
        toast.success("Lead arquivado com sucesso.");
      } else {
        toast.error("Erro ao arquivar lead.");
      }
    });
  };

  const onUnarchive = () => {
    startTransition(async () => {
      const result = await unarchiveRecoveryAction(id);
      if (result.success) {
        toast.success("Lead restaurado com sucesso.");
      } else {
        toast.error("Erro ao restaurar lead.");
      }
    });
  };

  const onDelete = () => {
    if (!confirm("Tem certeza que deseja deletar permanentemente este registro? Esta ação não pode ser desfeita.")) return;
    
    startTransition(async () => {
      const result = await deleteRecoveryAction(id);
      if (result.success) {
        toast.success("Lead removido permanentemente.");
      } else {
        toast.error("Erro ao remover lead.");
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isArchived ? (
        <button
          onClick={onUnarchive}
          disabled={isPending}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 disabled:opacity-50"
          title="Restaurar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={onArchive}
          disabled={isPending}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100 disabled:opacity-50"
          title="Arquivar"
        >
          <Archive className="h-4 w-4" />
        </button>
      )}
      
      <button
        onClick={onDelete}
        disabled={isPending}
        className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
        title="Deletar Definitivamente"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
