"use client";

import React, { useTransition, useState } from "react";
import { saveProductAction } from "@/actions/admin-products-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, Category } from "@prisma/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";

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
  const [sku, setSku] = useState(() => {
    if (initialData?.sku) return initialData.sku;
    // Geração automática inicial para novos produtos
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date().getTime().toString().slice(-4);
    return `ST-${random}-${date}`;
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId || categories[0]?.id || "");

  const handleGenerateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date().getTime().toString().slice(-4);
    const newSku = `ST-${random}-${date}`;
    setSku(newSku);
    toast.info("Novo SKU gerado com sucesso!", {
      description: newSku,
      icon: <RefreshCw className="h-4 w-4" />
    });
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveProductAction(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(initialData ? "Equipamento revisado e salvo com sucesso!" : "Novo equipamento catalogado e publicado!");
      router.push("/admin/products");
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
          <label htmlFor="product-sku" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Código SKU (Auto)</label>
          <div className="relative flex gap-2">
            <input 
              id="product-sku"
              type="text" 
              name="sku" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required 
              placeholder="ST-0000-0000"
              className="h-12 flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all focus:bg-black/60 shadow-sm" 
            />
            <button
              type="button"
              onClick={handleGenerateSKU}
              className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Gerar novo SKU"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="product-category" className="text-sm font-bold text-slate-400 uppercase tracking-tight">Categoria</label>
          <input type="hidden" name="categoryId" value={categoryId} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-12 w-full bg-black/40 border-white/10 rounded-xl">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-tight">Galeria de Fotos</label>
          <p className="text-xs text-slate-500">Gerencie as imagens que os clientes verão no catálogo.</p>
        </div>
        
        {images.map((url, i) => (
          <input key={`img-${i}`} type="hidden" name="images" value={url} />
        ))}
        
        <ImageUpload 
          value={images} 
          onChange={(urls) => setImages(urls)}
          onRemove={(url) => setImages(images.filter((i) => i !== url))}
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
