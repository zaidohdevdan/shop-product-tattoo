"use client";

import React, { useTransition } from "react";
import { Archive, Trash2, RotateCcw } from "lucide-react";
import { archiveNewsletterAction, unarchiveNewsletterAction, deleteNewsletterAction } from "@/actions/newsletter-actions";
import { toast } from "sonner";
import { SubscriptionStatus } from "@prisma/client";

interface NewsletterActionsProps {
  id: string;
  status: SubscriptionStatus;
}

export function NewsletterActions({ id, status }: NewsletterActionsProps) {
  const [isPending, startTransition] = useTransition();

  const onArchive = () => {
    startTransition(async () => {
      const result = await archiveNewsletterAction(id);
      if (result.success) {
        toast.success("Inscrição arquivada.");
      } else {
        toast.error("Erro ao arquivar.");
      }
    });
  };

  const onUnarchive = () => {
    startTransition(async () => {
      const result = await unarchiveNewsletterAction(id);
      if (result.success) {
        toast.success("Inscrição restaurada.");
      } else {
        toast.error("Erro ao restaurar.");
      }
    });
  };

  const onDelete = () => {
    if (!confirm("Tem certeza que deseja deletar este e-mail permanentemente?")) return;
    
    startTransition(async () => {
      const result = await deleteNewsletterAction(id);
      if (result.success) {
        toast.success("E-mail removido definitivamente.");
      } else {
        toast.error("Erro ao remover.");
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {status === SubscriptionStatus.ARCHIVED ? (
        <button
          onClick={onUnarchive}
          disabled={isPending}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 disabled:opacity-50"
          title="Restaurar para Ativos"
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
        title="Deletar permanentemente"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
