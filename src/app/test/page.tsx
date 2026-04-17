"use client";

import { ProductBuyAction } from "@/components/product/ProductBuyAction";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white flex flex-col items-center justify-center gap-12">
      <div className="max-w-md w-full flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center">Teste Componente Compra</h1>
        
        <div className="bg-neutral-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">SKU: TAT-001</span>
            <h2 className="text-2xl font-bold">Máquina de Tatuagem Pro Stealth</h2>
            <p className="text-neutral-400">
              Alta precisão e vibração mínima para traços perfeitos e sombreamentos suaves.
            </p>
          </div>
          
          <ProductBuyAction 
            product={{
              id: "test-id-1",
              name: "Máquina de Tatuagem Pro Stealth",
              price: 1999.90,
              image: "/placeholder-fallback.png",
              sku: "TAT-001",
              slug: "maquina-de-tatuagem-pro-stealth",
            }}
          />
        </div>
      </div>
      
      <p className="text-neutral-500 text-sm">
        Redimensione para simular mobile (botão sticky no rodapé)
      </p>
    </div>
  );
}
