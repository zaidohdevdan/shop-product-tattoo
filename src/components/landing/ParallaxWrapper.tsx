"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  imageSrc: string;
}

export function ParallaxWrapper({ children, imageSrc }: ParallaxWrapperProps) {
  const ref = useRef(null);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);

  // Track scroll exactly as this large section passes through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Move the background vertically while the user scrolls
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  if (!_hasHydrated) {
    return (
      <section ref={ref} className="relative overflow-hidden w-full bg-black min-h-[400px]">
        <div className="relative z-10 w-full">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative overflow-hidden w-full bg-black">
      {/* Animated Backplate */}
      <motion.div 
         style={{ y: yParallax }}
         className="absolute inset-0 z-0 origin-center scale-[1.3]"
      >
         <Image 
           src={imageSrc} 
           alt="Parallax Texture" 
           fill 
           sizes="100vw"
           className="object-cover opacity-20 pointer-events-none" 
         />
         <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply" />
      </motion.div>
      
      {/* Gradients to blend smoothly with adjacent pure-black sections */}
      <div className="absolute inset-0 z-0 bg-linear-to-b from-black via-black/70 to-black pointer-events-none" />

      {/* Actual Content (Server Components and Client Components) */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}
