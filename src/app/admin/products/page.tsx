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

async function PaginationSection({ searchParamsPromise, limit }: { searchParamsPromise: PageProps['searchParams'], limit: number }) {
  const params = await searchParamsPromise;
  const currentPage = Number(params.page) || 1;
  const filters: ProductFilters = {
    search: params.search,
    status: params.status || 'all',
    stock: params.stock,
    categoryId: params.categoryId,
  };
  
  const totalProducts = await productService.getProductsCount(filters);
  const totalPages = Math.ceil(totalProducts / limit);

  return <Pagination totalPages={totalPages} currentPage={currentPage} />;
}

async function FiltersSection() {
  // Categorias para o filtro são rápidas mas ainda assim podem ser suspensas
  const categories = await categoryService.getAllCategories(1, 100);
  return <ProductFiltersUI categories={categories} />;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const limit = 10;

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-600 selection:text-white">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gerenciar Inventário</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Painel de Controle de Produtos e Serviços</p>
        </div>
        <Button asChild variant="admin" size="lg" className="shrink-0 gap-3 transition-all active:scale-95">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            <span>Novo Registro</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-20 w-full bg-white rounded-2xl animate-pulse border border-slate-100" />}>
        <FiltersSection />
      </Suspense>

      <Suspense fallback={<ProductTableSkeleton />}>
        {/* Passamos o Promise diretamente para o componente que vai resolvê-lo */}
        <ProductTableWithParams searchParamsPromise={searchParams} limit={limit} />
      </Suspense>

      <Suspense fallback={<div className="h-12 w-64 mx-auto bg-white rounded-xl animate-pulse border border-slate-100" />}>
        <PaginationSection searchParamsPromise={searchParams} limit={limit} />
      </Suspense>
    </div>
  );
}

async function ProductTableWithParams({ searchParamsPromise, limit }: { searchParamsPromise: PageProps['searchParams'], limit: number }) {
  const params = await searchParamsPromise;
  const currentPage = Number(params.page) || 1;
  const filters: ProductFilters = {
    page: currentPage,
    limit,
    search: params.search,
    status: params.status || 'all',
    stock: params.stock,
    sort: params.sort || 'newest',
    categoryId: params.categoryId,
  };

  return <ProductTable filters={filters} />;
}
