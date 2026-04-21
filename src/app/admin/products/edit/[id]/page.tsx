import React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (!product) {
    return notFound();
  }

  // Next.js não serializa objetos Prisma.Decimal pro Client
  const plainProduct = {
    ...product,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
  };

  const categories = await prisma.category.findMany();
  
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-2 selection:bg-indigo-100 selection:text-indigo-900">
      <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Editar Registro</h1>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-10 max-w-xl leading-relaxed">
        Revisão dos dados fiscais e de vitrine para <span className="text-indigo-600 font-black tracking-widest">{product.sku}</span>. 
        Suas mudanças serão atualizadas no banco de dados Neon assim que você salvar.
      </p>
      
      <ProductForm initialData={plainProduct} categories={categories} />
    </div>
  );
}
