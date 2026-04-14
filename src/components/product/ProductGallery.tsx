"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-3xl border border-white/5 bg-zinc-900 flex items-center justify-center">
        <span className="text-zinc-600 text-sm">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 cursor-zoom-in group"
        onClick={() => setZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${name} — imagem ${active + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4 text-white" />
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              title="Imagem anterior"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Próxima imagem"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              title={`Ver imagem ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                active === i
                  ? "border-indigo-500 opacity-100"
                  : "border-white/5 opacity-50 hover:opacity-80"
              )}
            >
              <Image src={src} alt={`Miniatura ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-full max-w-4xl w-full aspect-square"
            >
              <Image
                src={images[active]}
                alt={name}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
