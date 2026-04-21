"use client";

import { useState, useTransition } from "react";
import { deleteProductAction } from "@/actions/admin-products-actions";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { Button } from "@/components/ui/button";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await deleteProductAction(id);
        
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Produto excluído permanentemente!");
        }
      } catch {
        toast.error("Ocorreu um erro ao tentar excluir o produto.");
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
        disabled={isPending}
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
        type="button"
        title="Excluir Permanentemente"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>

      <ConfirmActionDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title="Excluir Produto?"
        description={`Você está prestes a excluir "${name}" permanentemente do catálogo. Esta ação não pode ser desfeita.`}
        confirmText="Excluir Definitivamente"
      />
    </>
  );
}
