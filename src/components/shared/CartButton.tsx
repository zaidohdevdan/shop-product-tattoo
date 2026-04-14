"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";

export function CartButton() {
  const { totalItems, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const count = totalItems();

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleCart}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white/10"
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
    </button>
  );
}
