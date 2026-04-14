import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "./ProductCard";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (products.length === 0) return null;

  return (
    <section id="products" className="py-24 px-6 relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
              Catálogo Selecionado
            </h2>
            <h3 className="mt-4 text-4xl font-black text-white md:text-5xl">
              Produtos em Destaque
            </h3>
          </div>
          <button
            type="button"
            title="Ver catálogo completo"
            className="text-sm font-bold uppercase tracking-widest text-white/50 transition-colors hover:text-indigo-500">
            Ver catálogo completo →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
