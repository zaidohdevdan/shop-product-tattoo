"use client";

import React, { useTransition } from "react";
import { saveProductAction } from "@/actions/admin-products-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, Category } from "@prisma/client";

export type ClientSafeProduct = Omit<Product, "price"> & {
  price: number;
};

interface ProductFormProps {
  initialData?: ClientSafeProduct | null;
  categories: Category[];
}

export function ProductForm({ initialData = null, categories = [] }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveProductAction(formData);
        toast.success(initialData ? "Equipamento revisado e salvo com sucesso!" : "Novo equipamento catalogado e publicado!");
        router.push("/admin/products");
      } catch {
        toast.error("Ocorreu um erro ao salvar as informações.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-8 bg-zinc-950 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-zinc-400">Nome do Equipamento</span>
          <input 
            type="text" 
            name="name" 
            defaultValue={initialData?.name} 
            required 
            className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </label>
        
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-zinc-400">Código SKU</span>
          <input 
            type="text" 
            name="sku" 
            defaultValue={initialData?.sku} 
            required 
            className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-zinc-400">Categoria</span>
          <div className="relative">
            <select 
              name="categoryId" 
              defaultValue={initialData?.categoryId || (categories[0]?.id)} 
              className="h-12 w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-zinc-400">Preço (R$)</span>
          <input 
            type="number" 
            step="0.01" 
            name="price" 
            defaultValue={initialData?.price ? Number(initialData.price) : ""} 
            required 
            className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-zinc-400">Estoque Físico</span>
          <input 
            type="number" 
            name="stock" 
            defaultValue={initialData?.stock ?? 0} 
            required 
            min="0"
            className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 relative z-10">
        <span className="text-sm font-bold text-zinc-400">URLs das Imagens (Separadas por vírgula)</span>
        <input 
          type="text" 
          name="images" 
          defaultValue={initialData?.images?.join(", ")} 
          placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
          className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
        />
      </label>

      <label className="flex flex-col gap-2 relative z-10">
        <span className="text-sm font-bold text-zinc-400">Descrição Detalhada</span>
        <textarea 
          name="description" 
          defaultValue={initialData?.description} 
          required 
          rows={5}
          className="bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y transition-colors" 
        />
      </label>

      <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t border-white/5 mt-4 relative z-10 w-full">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="w-full md:w-auto px-6 py-3 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full md:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/20"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin mx-4" /> : (
            <span className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              {initialData ? "Atualizar" : "Salvar"} Registro
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
