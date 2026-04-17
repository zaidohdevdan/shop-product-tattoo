"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const studioPhotos = [
  {
    id: 1,
    src: "/images/landing/studio-interior-2.png",
    alt: "Ambiente do Estúdio",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "/images/products/maquina-stealth-1.png",
    alt: "Processo de Tatuagem",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    src: "/images/products/tinta-preto-1.png",
    alt: "Tintas Premium",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: 4,
    src: "/images/landing/studio-equipment.png",
    alt: "Equipamento Profissional",
    className: "md:col-span-1 md:row-span-1",
  },
];

export function StudioGallery() {
  return (
    <section id="studio" className="py-24 px-6 relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
            Experiência Única
          </h2>
          <h3 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Onde a Arte Ganha Vida
          </h3>
          <p className="mt-6 max-w-2xl text-zinc-500">
            Conheça nosso espaço planejado para oferecer o máximo de conforto, higiene e inspiração para sua próxima tatuagem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 h-[800px] md:h-[600px]">
          {studioPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={photo.className + " relative overflow-hidden rounded-3xl border border-white/5"}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <p className="text-sm font-bold text-white uppercase tracking-wider">{photo.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
