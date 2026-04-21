import React from "react";
import { productService, type ProductFilters } from "@/services/product-service";
import { ProductTableClient } from "./ProductTableClient";

interface ProductTableProps {
  filters: ProductFilters;
}

// Helper to validate Cloudinary URLs
function isValidCloudinaryUrl(url: string) {
  if (!url) return false;
  if (!url.includes('cloudinary.com')) return true;
  const brokenPatterns = ['/c_pad', '/c_fill', '/e_background_removal'];
  return !brokenPatterns.some(pattern => url.endsWith(pattern)) && url.split('/').length > 6;
}

/**
 * [PERF] Server Component que busca os dados no banco e os entrega
 * prontos e serializados para o componente de cliente que cuida da interação.
 */
export async function ProductTable({ filters }: ProductTableProps) {
  const productsResult = await productService.getProducts(filters);

  // Converter para objeto plano serializável (RSC safe)
  const products = productsResult.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    costPrice: Number(p.costPrice),
    stock: p.stock,
    active: p.active,
    images: p.images.filter(isValidCloudinaryUrl),
    category: {
      name: p.category?.name || "Sem Categoria"
    }
  }));

  if (products.length === 0) {
    return (
      <div className="premium-card p-24 flex flex-col items-center justify-center text-center gap-5">
        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-4xl shadow-inner">📦</div>
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nenhum produto encontrado</h3>
          <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium">Tente ajustar seus filtros ou faça uma nova busca para encontrar o que precisa.</p>
        </div>
      </div>
    );
  }

  return <ProductTableClient products={products} />;
}
