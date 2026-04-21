import { productService } from "@/services/product-service";
import { categoryService } from "@/services/category-service";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogFilters } from "@/components/product/CatalogFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Produtos — Shop Tattoo",
  description:
    "Máquinas, tintas, agulhas e acessórios profissionais para tatuagem. Os melhores equipamentos do mercado com entrega rápida.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; search?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { categoria, search, sort } = await searchParams;

  const [categories, products] = await Promise.all([
    categoryService.getAllCategories(),
    productService.getProducts({ categoria, search, sort, status: 'active', limit: 32 }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="border-b border-white/5 bg-zinc-950 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">
                  Loja
                </p>
                <h1 className="text-5xl font-black text-white md:text-7xl">
                  Catálogo
                </h1>
                <p className="mt-4 text-zinc-500 max-w-xl">
                  {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
                  {categoria ? `na categoria selecionada` : "disponíveis"}
                </p>
              </div>

              {/* Quick Search */}
              <div className="w-full max-w-md">
                <form action="/products" className="relative group">
                  <input 
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="O que você está procurando?"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-6 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-all group-hover:border-white/20"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  {categoria && <input type="hidden" name="categoria" value={categoria} />}
                  {sort && <input type="hidden" name="sort" value={sort} />}
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {/* Filters */}
            <CatalogFilters
              categories={categories}
              activeSlug={categoria}
              activeSort={sort}
              search={search}
            />

            {/* Grid */}
            {products.length === 0 ? (
              <div className="mt-24 flex flex-col items-center text-center gap-4">
                <p className="text-6xl">📦</p>
                <p className="text-xl font-bold text-white">
                  Nenhum produto encontrado
                </p>
                <p className="text-zinc-500">
                  Tente outra categoria ou volte em breve.
                </p>
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      sku: product.sku,
                      stock: product.stock,
                      images: product.images,
                      price: Number(product.price),
                      costPrice: Number(product.costPrice),
                      category: product.category,
                    }}
                    priority={index < 2}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
