"use client";

import React, { useEffect, useState } from "react";
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
    sku: string;
    slug: string;
  };
  className?: string;
}

export function ProductBuyAction({ product, className }: ProductBuyActionProps) {
  const { addItem, setOpen } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBuyNow = () => {
    addItem({
      ...product,
      quantity: 1,
    });
    setOpen(true);
  };

  return (
    <Button
      size="lg"
      className={cn(
        "flex-1 gap-2 font-bold uppercase tracking-wide transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white",
        isMobile && "fixed bottom-4 left-4 right-4 z-50 h-16 rounded-2xl shadow-xl shadow-indigo-900/20 border border-indigo-400/20",
        !isMobile && "h-14 rounded-2xl",
        className
      )}
      onClick={handleBuyNow}
    >
      <Zap className="h-5 w-5 fill-current" />
      Comprar Agora
    </Button>
  );
}
