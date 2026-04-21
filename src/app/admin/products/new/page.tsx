import React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  
  return (
    <div className="p-10 max-w-6xl mx-auto space-y-2 selection:bg-indigo-100 selection:text-indigo-900">
      <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Novo Registro</h1>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-10 max-w-xl leading-relaxed">
        Adicione um novo produto ao catálogo do ShopTattoo. Ele será ativado automaticamente 
        no sistema e refletido em tempo real na vitrine.
      </p>
      
      <ProductForm categories={categories} />
    </div>
  );
}
