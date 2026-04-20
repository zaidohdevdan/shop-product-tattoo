import { productService } from "@/services/product-service";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductBuyAction } from "@/components/product/ProductBuyAction";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ChevronRight, Package, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductJsonLd } from "@/components/shared/ProductJsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} — Shop Tattoo`,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await productService.getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await productService.getRelatedProducts(
    product.categoryId,
    product.id
  );

  const price = Number(product.price);

  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 pt-24">
        <ProductJsonLd 
          product={{
            name: product.name,
            description: product.description,
            image: product.images[0] || "/placeholder-fallback.png",
            price: price,
            sku: product.sku,
            slug: product.slug,
            category: product.category.name,
          }}
          siteUrl="https://shoptattoo.com.br"
        /> 
        {/* Breadcrumb */}
        <div className="border-b border-white/5 bg-zinc-950 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-white transition-colors">Catálogo</Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/products?categoria=${product.category.slug}`}
              className="hover:text-white transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              {/* Left — Gallery */}
              <ProductGallery images={product.images} name={product.name} />

              {/* Right — Info */}
              <div className="flex flex-col gap-8">
                {/* Category + SKU */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/products?categoria=${product.category.slug}`}
                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 transition-colors hover:bg-indigo-500/20"
                  >
                    {product.category.name}
                  </Link>
                  <span className="text-xs font-medium text-zinc-600">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white">
                    R${" "}
                    {price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  {product.stock > 0 ? (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      Em estoque · {product.stock} un.
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                      Esgotado
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/5" />

                {/* Description */}
                <div>
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Descrição
                  </h2>
                  <p className="leading-relaxed text-zinc-400">
                    {product.description}
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Truck, label: "Envio Rápido" },
                    { icon: ShieldCheck, label: "Garantia" },
                    { icon: Package, label: "Embalagem Segura" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-center"
                    >
                      <Icon className="h-5 w-5 text-indigo-400" />
                      <span className="text-xs font-semibold text-zinc-400">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Buy Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: price,
                      image: product.images[0] || "/placeholder-fallback.png",
                      stock: product.stock,
                      sku: product.sku,
                      slug: product.slug,
                    }}
                  />
                  <ProductBuyAction
                    product={{
                      id: product.id,
                      name: product.name,
                      price: price,
                      image: product.images[0] || "/placeholder-fallback.png",
                      stock: product.stock,
                      sku: product.sku,
                      slug: product.slug,
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-white/5 bg-zinc-950 px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-10 text-2xl font-black text-white">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{ ...p, price: Number(p.price) }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
