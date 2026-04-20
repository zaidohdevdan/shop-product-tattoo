import React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-2">Novo Produto</h1>
      <p className="text-zinc-500 mb-8 max-w-xl leading-relaxed">
        Adicione um novo produto ao catálogo do ShopTattoo. Ele será ativado automaticamente 
        no sistema e refletido em tempo real na vitrine.
      </p>
      
      <ProductForm categories={categories} />
    </div>
  );
}
