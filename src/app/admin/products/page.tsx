import React from 'react';
import Link from 'next/link';
import { productService } from '@/services/product-service';
import { Plus, CheckCircle2, XCircle, Edit2 } from 'lucide-react';
import { ToggleStatusButton } from '@/components/admin/ToggleStatusButton';
import Image from 'next/image';

export default async function AdminProductsPage() {
  // Fetch all products including inactive ones for the admin panel
  const products = await productService.getProducts({ includeInactive: true });

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Equipamentos</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Sua vitrine de estoque</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex shrink-0 items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 md:h-12 px-4 md:px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Novo Registro</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Estoque</th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Preço</th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                        <Image 
                          src={product.images[0] || '/placeholder-fallback.png'} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="font-bold text-white line-clamp-2 max-w-[250px]">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    <span className="bg-white/5 px-3 py-1 rounded-full">{product.category.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-400">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {product.stock > 0 ? (
                      <span className="text-zinc-300 font-bold">{product.stock} un.</span>
                    ) : (
                      <span className="text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full text-xs">Zerado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-white text-right whitespace-nowrap">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.active ? (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        Ativo
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-zinc-500/10 text-zinc-400 px-3 py-1 rounded-full text-xs font-bold">
                        <XCircle className="h-3 w-3" />
                        Oculto
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-indigo-500/20 rounded-xl transition-colors"
                        title="Editar Produto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <ToggleStatusButton id={product.id} active={product.active} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <p className="text-zinc-500 font-medium">Inventário Vazio</p>
                       <p className="text-xs text-zinc-600">Nenhum equipamento foi cadastrado ainda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
