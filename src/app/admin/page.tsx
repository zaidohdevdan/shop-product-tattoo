import React from "react";
import { productService } from "@/services/product-service";
import { Package, Tag, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch active products initially for the dashboard overview
  const products = await productService.getProducts({});
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  const uniqueCategories = new Set(products.map(p => p.categoryId)).size;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-8">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-[2rem] border border-white/5 bg-zinc-950 flex flex-col gap-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Equipamentos Ativos</h3>
            <p className="text-4xl font-black text-white mt-1">{totalProducts}</p>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border border-white/5 bg-zinc-950 flex flex-col gap-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
            <Tag className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Categorias em Uso</h3>
            <p className="text-4xl font-black text-white mt-1">{uniqueCategories}</p>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border border-red-500/10 bg-red-500/5 flex flex-col gap-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-500/70 uppercase tracking-wider flex justify-between">
              Estoque Crítico
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-4xl font-black text-red-400">{lowStock + outOfStock}</p>
              <span className="text-sm text-red-500/50">itens pedindo reposição</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 rounded-[2rem] border border-white/5 bg-zinc-950 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 opacity-5 pointer-events-none">
          <Package className="w-64 h-64" />
        </div>
        <h2 className="text-xl font-bold text-white mb-4">Novo Setup Completo</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
          A arquitetura administrativa agora conta com uma proteção robusta rodando diretamente na &rdquo;Edge&rdquo; do Next.js via Middleware e JWT (biblioteca <code>jose</code>). 
          Isso significa que acessos não-autorizados não passam nem da camada de rede. O sistema de exclusão de produtos usará <strong>Soft Delete</strong> alterando a propriedade <code>active</code>, preservando seu histórico valioso.
        </p>
      </div>
    </div>
  );
}
