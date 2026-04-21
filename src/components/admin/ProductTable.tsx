import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { productService, type ProductFilters } from "@/services/product-service";
import { ToggleStatusButton } from "./ToggleStatusButton";
import { DeleteProductButton } from "./DeleteProductButton";
import { ProductTableClient, RowCheckbox } from "./ProductTableClient";

interface ProductTableProps {
  filters: ProductFilters;
}

// Helper to validate Cloudinary URLs
function isValidCloudinaryUrl(url: string) {
  if (!url) return false;
  if (!url.includes('cloudinary.com')) return true;
  const brokenPatterns = ['/c_pad', '/c_fill', '/e_background_removal'];
  return !brokenPatterns.some(pattern => url.endsWith(pattern)) && url.split('/').length > 6;
}

export async function ProductTable({ filters }: ProductTableProps) {
  const productsResult = await productService.getProducts(filters);

  const products = productsResult.map(p => ({
    ...p,
    price: Number(p.price),
    costPrice: Number(p.costPrice),
    images: p.images.filter(isValidCloudinaryUrl)
  }));

  if (products.length === 0) {
    return (
      <div className="premium-card p-20 flex flex-col items-center justify-center text-center gap-4">
        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-4xl">📦</div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nenhum produto encontrado</h3>
        <p className="text-slate-500 max-w-xs">Tente ajustar seus filtros ou faça uma nova busca para encontrar o que precisa.</p>
      </div>
    );
  }

  return (
    <ProductTableClient products={products.map((p) => ({ id: p.id }))}>
      {({ selectedIds, toggleOne, isAllSelected, toggleAll }) => (
        <div className="premium-card overflow-hidden animate-in fade-in zoom-in-95 duration-700">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-700 border-b border-slate-600">
                  {/* Select-all checkbox */}
                  <th className="pl-5 pr-2 py-6 w-10">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input type="checkbox" checked={isAllSelected} onChange={toggleAll} className="sr-only peer" />
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        isAllSelected ? "bg-indigo-500 border-indigo-400" : "border-slate-500 hover:border-indigo-400"
                      )}>
                        {isAllSelected && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </th>
                  <th className="pl-4 pr-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-left">Produto</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-left">Categoria</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-center">SKU</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-right">Disponível</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-right">Valor Unitário</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-right">Margem</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-center">Status</th>
                  <th className="pl-6 pr-10 py-6 text-xs font-black text-slate-300 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock < 5;
                  const isSelected = selectedIds.has(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        "group transition-all duration-500 border-l-4 border-transparent relative",
                        isSelected
                          ? "bg-indigo-50/60 border-indigo-500"
                          : isOutOfStock
                          ? "bg-rose-50/10 hover:bg-rose-50/60 hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/5 hover:-translate-y-0.5"
                          : isLowStock
                          ? "bg-amber-50/10 hover:bg-amber-50/60 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5"
                          : "hover:bg-slate-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                      )}
                    >
                      <RowCheckbox id={product.id} checked={isSelected} onChange={toggleOne} />
                      <td className="pl-4 pr-6 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative h-14 w-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-500">
                            <Image
                              src={product.images[0] || '/placeholder-fallback.png'}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-[280px] tracking-tight text-sm">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="executive-badge bg-slate-100 text-slate-700 border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-tight">{product.category.name}</span>
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-indigo-600 tracking-wide font-mono opacity-90 text-center">
                        {product.sku}
                      </td>
                      <td className="px-6 py-6 text-sm text-right">
                        {!isOutOfStock ? (
                          <div className="flex flex-col items-end">
                            <span className={cn(
                              "font-bold tracking-tight text-right",
                              isLowStock ? "text-amber-600" : "text-slate-900"
                            )}>
                              {product.stock} <span className="text-[10px] text-slate-500 font-bold uppercase ml-1">Unidades</span>
                            </span>
                            {isLowStock && (
                              <span className="text-[9px] font-black uppercase text-amber-500 tracking-tighter animate-pulse">Estoque Baixo</span>
                            )}
                          </div>
                        ) : (
                          <span className="executive-badge bg-rose-50 text-rose-700 border-rose-100 font-black px-3">Esgotado</span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-base font-black text-slate-900 text-right whitespace-nowrap tracking-tight">
                        <span className="text-xs text-slate-400 mr-1 font-bold">R$</span>
                        {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-6 text-right">
                        {(() => {
                          const profit = product.price - product.costPrice;
                          const margin = (profit / product.price) * 100;
                          return (
                            <span className={cn(
                              "text-[11px] font-black px-2.5 py-1 rounded-lg border",
                              margin >= 30 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              margin >= 10 ? "bg-amber-50 text-amber-700 border-amber-100" :
                              "bg-rose-50 text-rose-700 border-rose-100"
                            )}>
                              {margin.toFixed(0)}%
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-6 text-center">
                        {product.active ? (
                          <span className="executive-badge bg-emerald-50 text-emerald-700 border-emerald-100 px-3">Ativo</span>
                        ) : (
                          <span className="executive-badge bg-slate-100 text-slate-400 border-slate-200 px-3">Oculto</span>
                        )}
                      </td>
                      <td className="pl-6 pr-10 py-6">
                        <div className="flex items-center justify-end gap-3 transition-all">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 active:scale-90"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <ToggleStatusButton id={product.id} active={product.active} />
                          <DeleteProductButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-6 p-6">
            {products.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isLowStock = product.stock > 0 && product.stock < 5;
              const isSelected = selectedIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className={cn(
                    "premium-card flex flex-col gap-4 p-5 transition-all duration-500 border-l-4",
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/40"
                      : isOutOfStock ? "border-rose-500 bg-rose-50/10"
                      : isLowStock ? "border-amber-500 bg-amber-50/10"
                      : "border-indigo-600 bg-white"
                  )}
                >
                  <div className="flex gap-4">
                    {/* Mobile checkbox */}
                    <label className="flex items-center cursor-pointer mt-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(product.id)} className="sr-only peer" />
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300 hover:border-indigo-400 bg-white"
                      )}>
                        {isSelected && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </label>
                    <div className="relative h-20 w-20 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                      <Image src={product.images[0] || '/placeholder-fallback.png'} alt={product.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-black text-slate-900 tracking-tight leading-tight line-clamp-2">{product.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category.name}</span>
                      </div>
                      <div className="font-mono text-xs text-indigo-600 font-bold opacity-75">{product.sku}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Preço</span>
                      <span className="font-black text-slate-900">
                        <span className="text-xs text-slate-400 mr-0.5">R$</span>
                        {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {(() => {
                        const margin = ((product.price - product.costPrice) / product.price) * 100;
                        return (
                          <span className={cn(
                            "text-[9px] font-black uppercase mt-1",
                            margin >= 30 ? "text-emerald-500" : margin >= 10 ? "text-amber-500" : "text-rose-500"
                          )}>
                            Margem: {margin.toFixed(0)}%
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Estoque</span>
                      {!isOutOfStock ? (
                        <span className={cn("font-black tracking-tight", isLowStock ? "text-amber-600" : "text-slate-900")}>
                          {product.stock} <span className="text-[10px]">UN</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-black text-[10px] uppercase">Esgotado</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 gap-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/products/edit/${product.id}`} className="h-10 px-4 flex items-center gap-2 text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-slate-200">
                        <Edit2 className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                      <ToggleStatusButton id={product.id} active={product.active} />
                    </div>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>

                  {isLowStock && (
                    <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-2 text-center">
                      <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider">Atenção: Estoque Crítico</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ProductTableClient>
  );
}

