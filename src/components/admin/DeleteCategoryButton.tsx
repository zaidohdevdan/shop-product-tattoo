"use client";

import { useState, useTransition } from "react";
import { deleteCategoryAction } from "@/actions/admin-categories-actions";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";

interface DeleteCategoryButtonProps {
  id: string;
  productCount: number;
}

export function DeleteCategoryButton({ id, productCount }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = productCount > 0;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
         const formData = new FormData();
         formData.append("id", id);
         formData.append("productCount", productCount.toString());
         
         await deleteCategoryAction(formData);
         toast.success("Categoria deletada com sucesso!");
      } catch (e: unknown) {
         if (e instanceof Error) {
            toast.error(e.message);
         } else {
            toast.error("Erro ao deletar categoria.");
         }
      } finally {
         setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button 
        type="button"
        disabled={isDisabled || isPending}
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-xl transition-colors ${
          isDisabled 
           ? 'text-zinc-600 bg-black/20 cursor-not-allowed' 
           : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
        }`}
        title={isDisabled ? "Esvazie a categoria primeiro" : "Deletar Categoria"}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>

      <ConfirmActionDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title="Excluir Definitivamente?"
        description="Esta ação vai destruir permanentemente essa Categoria do banco de dados. Tem certeza?"
        confirmText="Excluir Permanentemente"
      />
    </>
  );
}
