"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    sku: string;
    slug: string;
  };
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity: 1,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant="outline"
      size="lg"
      className={cn(
        "flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 font-bold",
        className
      )}
    >
      <ShoppingCart className="h-5 w-5" />
      Adicionar ao Carrinho
    </Button>
  );
}
