"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.totalItems);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);

  const count = totalItems();

  if (!_hasHydrated) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCart}
      aria-label={`Ver carrinho (${count} itens)`}
      aria-expanded={isOpen ? "true" : "false"}
      aria-controls="cart-drawer"
      className="group relative rounded-full bg-white/5 text-white hover:bg-white/10"
    >
      <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
      
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-lg"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
