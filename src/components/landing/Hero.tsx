"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-20">
      {/* Background with Parallax */}
      <motion.div 
        style={{ y: yParallax }} 
        className="absolute inset-0 z-0 origin-top scale-110"
      >
        <Image
          src="/images/landing/studio-interior-2.png"
          alt="Tattoo Studio Interior"
          fill
          sizes="110vw"
          className="object-cover brightness-[0.3]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
            O melhor estúdio e loja de Fortaleza
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl text-5xl font-black uppercase leading-[1.1] tracking-tighter text-white md:text-8xl"
        >
          Tradição, Arte e <br />
          <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Equipamento de Elite
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl"
        >
          Fornecemos suprimentos profissionais para tatuadores e oferecemos a melhor experiência de tatuagem em um ambiente moderno e seguro.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/products">
            <Button variant="premium" size="lg" className="h-16 px-10 rounded-2xl text-lg group">
              Ver Catálogo de Produtos
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="https://wa.me/5585981025033" target="_blank" rel="noopener">
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm">
              Agendar Tatuagem
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-2 gap-8 divide-x divide-white/10 border-t border-white/10 pt-10 md:grid-cols-4"
        >
          <div className="flex flex-col gap-1 px-8">
            <span className="text-3xl font-black text-white">5k+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tatuagens</span>
          </div>
          <div className="flex flex-col gap-1 px-8">
            <span className="text-3xl font-black text-white">10+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Anos de XP</span>
          </div>
          <div className="flex flex-col gap-1 px-8">
            <span className="text-3xl font-black text-white">500+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Produtos</span>
          </div>
          <div className="flex flex-col gap-1 px-8">
            <span className="text-3xl font-black text-white">100%</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Satisfação</span>
          </div>
        </motion.div>
      </div>

      {/* Shadow Scroll Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent z-10" />
    </section>
  );
}
