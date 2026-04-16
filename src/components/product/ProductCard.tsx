"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    sku: string;
    images: string[];
    category: {
      name: string;
    } | null;
  };
  className?: string;
}

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || "/placeholder.png",
      quantity: 1,
      sku: product.sku,
      slug: product.slug,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/50 transition-all hover:bg-zinc-900",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Quick Buy Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
          >
            Ver Detalhes
          </Link>
          <Button
            variant="premium"
            size="icon"
            onClick={handleAddToCart}
            className="h-12 w-12 rounded-xl"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            {product.category?.name || "Geral"}
          </span>
          <span className="text-[10px] font-medium text-zinc-500">
            SKU: {product.sku}
          </span>
        </div>
        
        <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-white">
            R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <ArrowRight className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
        </div>
      </div>
    </motion.div>
  );
}
