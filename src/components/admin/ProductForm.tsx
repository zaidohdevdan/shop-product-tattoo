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
    <form action={handleSubmit} className="flex flex-col gap-8 bg-[#020617] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="product-name" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Nome do Equipamento</label>
          <input 
            id="product-name"
            type="text" 
            name="name" 
            defaultValue={initialData?.name} 
            required 
            placeholder="Ex: Máquina Pen Premium"
            className="h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="product-sku" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Código SKU</label>
          <input 
            id="product-sku"
            type="text" 
            name="sku" 
            defaultValue={initialData?.sku} 
            required 
            placeholder="BR-MT-001"
            className="h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="product-category" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Categoria</label>
          <div className="relative">
            <select 
              id="product-category"
              name="categoryId" 
              defaultValue={initialData?.categoryId || (categories[0]?.id)} 
              className="h-12 w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-all focus:bg-black/60 shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0f172a]">{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <Save className="h-4 w-4 rotate-90" /> {/* Simulating a chevron if no lucide icon for it here */}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="product-price" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Preço (R$)</label>
          <input 
            id="product-price"
            type="number" 
            step="0.01" 
            name="price" 
            defaultValue={initialData?.price ? Number(initialData.price) : ""} 
            required 
            placeholder="0,00"
            className="h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="product-stock" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Estoque Físico</label>
          <input 
            id="product-stock"
            type="number" 
            name="stock" 
            defaultValue={initialData?.stock ?? 0} 
            required 
            min="0"
            placeholder="0"
            className="h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <label htmlFor="product-images" className="text-sm font-bold text-slate-400 uppercase tracking-tight">URLs das Imagens (Separadas por vírgula)</label>
        <input 
          id="product-images"
          type="text" 
          name="images" 
          defaultValue={initialData?.images?.join(", ")} 
          placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
          className="h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
        />
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <label htmlFor="product-description" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Descrição Detalhada</label>
        <textarea 
          id="product-description"
          name="description" 
          defaultValue={initialData?.description} 
          required 
          rows={5}
          placeholder="Descreva as especificações técnicas e diferenciais do produto..."
          className="bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y transition-all focus:bg-black/60 shadow-sm" 
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8 border-t border-white/5 mt-4 relative z-10 w-full">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="w-full md:w-auto px-6 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          Descartar Alterações
        </button>
        <Button 
          type="submit" 
          variant="premium"
          size="lg"
          disabled={isPending}
          className="w-full md:w-auto min-w-[200px]"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin mx-4" /> : (
            <span className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              {initialData ? "Atualizar Equipamento" : "Publicar no Catálogo"}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
