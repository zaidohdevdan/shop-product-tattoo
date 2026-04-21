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
import Link from "next/link";

export type ClientSafeProduct = Omit<Product, "price" | "costPrice"> & {
  price: number;
  costPrice: number;
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

      toast.success(initialData ? "Produto revisado e salvo com sucesso!" : "Novo produto catalogado e publicado!");
      router.push("/admin/products");
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-6 md:gap-10 premium-card p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-32 bg-indigo-50 blur-[80px] rounded-full pointer-events-none opacity-50 product-form-glow" />
      
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Produto</label>
          <input 
            id="product-name"
            type="text" 
            name="name" 
            defaultValue={initialData?.name} 
            required 
            placeholder="Ex: Máquina Pen Premium"
            className="h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-6 text-zinc-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xs" 
          />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-sku" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código SKU (Auto)</label>
          <div className="relative flex gap-3">
            <input 
              id="product-sku"
              type="text" 
              name="sku" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required 
              placeholder="ST-0000-0000"
              className="h-14 flex-1 bg-slate-50/50 border border-slate-200 rounded-2xl px-6 text-zinc-900 font-black tracking-widest placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xs" 
            />
            <button
              type="button"
              onClick={handleGenerateSKU}
              className="h-14 w-14 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all active:scale-95 shadow-xs"
              title="Gerar novo SKU"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-category" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria de Destino</label>
          <input type="hidden" name="categoryId" value={categoryId} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-14 w-full bg-slate-50/50 border-slate-200 rounded-2xl px-6 text-zinc-900 font-bold focus:ring-4 focus:ring-indigo-500/5">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="font-bold text-slate-600 hover:text-zinc-900">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-cost-price" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor de Custo (R$)</label>
          <input 
            id="product-cost-price"
            type="number" 
            step="0.01" 
            name="costPrice" 
            defaultValue={initialData?.costPrice ? Number(initialData.costPrice) : ""} 
            required 
            placeholder="0,00"
            className="h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-6 text-zinc-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xs" 
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-price" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Final (R$)</label>
          <input 
            id="product-price"
            type="number" 
            step="0.01" 
            name="price" 
            defaultValue={initialData?.price ? Number(initialData.price) : ""} 
            required 
            placeholder="0,00"
            className="h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-6 text-zinc-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xs" 
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="product-stock" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantidade em Estoque</label>
          <input 
            id="product-stock"
            type="number" 
            name="stock" 
            defaultValue={initialData?.stock ?? 0} 
            required 
            min="0"
            placeholder="0"
            className="h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-6 text-zinc-900 font-black placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xs" 
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

      <div className="flex flex-col gap-2.5 relative z-10">
        <label htmlFor="product-description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Técnica</label>
        <textarea 
          id="product-description"
          name="description" 
          defaultValue={initialData?.description} 
          required 
          rows={5}
          placeholder="Ex: Produto de alta qualidade com acabamento anodizado..."
          className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-zinc-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 resize-y transition-all shadow-xs" 
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-100 mt-6 relative z-10 w-full">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Link href="/admin/products">
            Descartar Alterações
          </Link>
        </Button>
        <Button 
          type="submit" 
          variant="admin"
          size="lg"
          disabled={isPending}
          title={initialData ? "Salvar alterações do produto" : "Publicar novo produto na loja"}
          className="w-full md:w-auto h-14 md:h-16 px-6 md:px-10 md:tracking-[0.2em]"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <span className="flex items-center gap-2 md:gap-3">
              <Save className="h-5 w-5 shrink-0" />
              <span className="hidden md:inline">
                {initialData ? "Sincronizar Dados" : "Publicar Agora"}
              </span>
              <span className="md:hidden">
                {initialData ? "Salvar" : "Publicar"}
              </span>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
