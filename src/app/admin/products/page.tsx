import { categoryService } from '@/services/category-service';
import { Plus } from 'lucide-react';
import { Pagination } from '@/components/admin/Pagination';
import { ProductFilters as ProductFiltersUI } from '@/components/admin/ProductFilters';
import { productService, type ProductFilters } from '@/services/product-service';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductTableSkeleton } from '@/components/admin/ProductTableSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: 'active' | 'hidden' | 'all';
    stock?: 'in_stock' | 'out_of_stock' | 'all';
    sort?: string;
    categoryId?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;

  const filters: ProductFilters = {
    page: currentPage,
    limit,
    search: params.search,
    status: params.status || 'all',
    stock: params.stock,
    sort: params.sort || 'newest',
    categoryId: params.categoryId,
  };

  // Fetch parallel non-suspense data (categories for filter)
  const [totalProducts, categories] = await Promise.all([
    productService.getProductsCount(filters),
    categoryService.getAllCategories(1, 100),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-600 selection:text-white">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gerenciamento de Inventário</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Painel de Controle de Produtos e Serviços</p>
        </div>
        <Button asChild variant="admin" size="lg" className="shrink-0 gap-3">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            <span>Novo Registro</span>
          </Link>
        </Button>
      </div>

      <ProductFiltersUI categories={categories} />

      <Suspense key={JSON.stringify(params)} fallback={<ProductTableSkeleton />}>
        <ProductTable filters={filters} />
      </Suspense>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
