import Link from 'next/link';
import { productService, type ProductFilters } from '@/services/product-service';
import { Plus, Edit2 } from 'lucide-react';
import { ToggleStatusButton } from '@/components/admin/ToggleStatusButton';
import { Pagination } from '@/components/admin/Pagination';
import { ProductFilters as ProductFiltersUI } from '@/components/admin/ProductFilters';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageProps {
  searchParams: Promise<{ 
    page?: string;
    search?: string;
    status?: 'active' | 'hidden' | 'all';
    stock?: 'in_stock' | 'out_of_stock' | 'all';
  }>;
}

// Função utilitária para validar se a URL do Cloudinary está completa (contém um ID público de recurso)
function isValidCloudinaryUrl(url: string) {
  if (!url) return false;
  if (!url.includes('cloudinary.com')) return true; // Permite locais/outros se houver
  
  // URLs quebradas reportadas terminam em /c_pad, /c_fill ou /e_background_removal sem o ID do arquivo
  const brokenPatterns = ['/c_pad', '/c_fill', '/e_background_removal'];
  const isTruncated = brokenPatterns.some(pattern => url.endsWith(pattern));
  
  // Uma URL válida deve ter algo após o /upload/ (ou transformações) que não seja apenas a transformação em si
  return !isTruncated && url.split('/').length > 6;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { page, search, status, stock } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  const filters: ProductFilters = {
    page: currentPage,
    limit,
    search,
    status: status || 'active',
    stock,
  };

  // Fetch products with pagination and filters
  const productsResult = await productService.getProducts(filters);
  const totalProducts = await productService.getProductsCount(filters);
  const totalPages = Math.ceil(totalProducts / limit);

  // Sanitiza imagens em tempo de exibição para proteger a UI
  const products = productsResult.map(p => ({
    ...p,
    images: p.images.filter(isValidCloudinaryUrl)
  }));

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 selection:bg-indigo-600 selection:text-white">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gerenciamento de Inventário</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Painel de Controle de Produtos e Serviços</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex shrink-0 items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest h-12 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95 text-[11px]"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Registro</span>
        </Link>
      </div>

      <ProductFiltersUI />

      <div className="premium-card overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Disponível</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Unitário</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const isOutOfStock = product.stock === 0;
                return (
                  <tr 
                    key={product.id} 
                    className={cn(
                      "group transition-all duration-200",
                      isOutOfStock ? "bg-rose-50/20" : "hover:bg-slate-50/50"
                    )}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                          <Image 
                            src={product.images[0] || '/placeholder-fallback.png'} 
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-[200px] tracking-tight uppercase text-xs">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="executive-badge bg-slate-50 text-slate-600 border-slate-100">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black text-indigo-600 tracking-widest uppercase">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-right">
                      {!isOutOfStock ? (
                        <span className="text-slate-600 font-black tracking-widest">{product.stock} <span className="text-[9px] text-slate-400 font-bold uppercase">ITENS</span></span>
                      ) : (
                        <span className="executive-badge bg-rose-50 text-rose-700 border-rose-100 font-black">Esgotado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-slate-900 text-right whitespace-nowrap tracking-tight">
                      R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.active ? (
                        <span className="executive-badge bg-emerald-50 text-emerald-700 border-emerald-100">
                           Ativo
                        </span>
                      ) : (
                        <span className="executive-badge bg-slate-100 text-slate-400 border-slate-200">
                           Oculto
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <ToggleStatusButton id={product.id} active={product.active} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
