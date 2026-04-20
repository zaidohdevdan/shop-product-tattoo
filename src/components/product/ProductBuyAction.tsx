"use client";

import React from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface ProductBuyActionProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    sku: string;
    slug: string;
  };
  className?: string;
}

export function ProductBuyAction({ product, className }: ProductBuyActionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setOpen = useCartStore((state) => state.setOpen);
  const isOutOfStock = product.stock <= 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({
      ...product,
      quantity: 1,
    });
    setOpen(true);
  };

  return (
    <Button
      size="lg"
      disabled={isOutOfStock}
      className={cn(
        "w-full h-14 rounded-2xl gap-2 font-bold uppercase tracking-wide transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed",
        className
      )}
      onClick={handleBuyNow}
    >
      <Zap className={cn("h-5 w-5 fill-current", isOutOfStock && "opacity-20")} />
      {isOutOfStock ? "Esgotado" : "Comprar Agora"}
    </Button>
  );
}
