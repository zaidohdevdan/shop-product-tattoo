"use client";

import { useState, useTransition } from "react";
import { toggleProductStatusAction } from "@/actions/admin-products-actions";
import { Trash2, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { Button } from "@/components/ui/button";

interface ToggleButtonProps {
  id: string;
  active: boolean;
}

export function ToggleStatusButton({ id, active }: ToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await toggleProductStatusAction(id, active);
        toast.success(active ? "Produto ocultado da vitrine!" : "Produto restaurado para a loja com sucesso!");
      } catch {
        toast.error("Ocorreu um erro ao alterar o status do produto.");
      } finally {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={cn(
          "h-9 w-9 p-0 rounded-xl",
          active 
            ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10" 
            : "text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10"
        )}
        aria-label={active ? "Ocultar Produto" : "Restaurar Anúncio"}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : active ? (
          <Trash2 className="h-4 w-4" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
      </Button>

      <ConfirmActionDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title={active ? "Ocultar Produto?" : "Restaurar Produto?"}
        description={
          active
            ? "Remover este item da loja pública? Ele não será deletado do banco de dados, apenas ficará invisível para clientes."
            : "Restaurar este item e deixá-lo visível para compra novamente?"
        }
        confirmText={active ? "Sim, Ocultar" : "Sim, Restaurar"}
        isDestructive={active}
      />
    </>
  );
}
