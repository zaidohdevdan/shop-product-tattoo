"use client";

import React from "react";
import { Truck, Ticket } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="relative z-[60] w-full bg-linear-to-r from-indigo-600 via-violet-700 to-indigo-600 px-4 py-2 overflow-hidden shadow-[0_4px_20px_-5px_rgba(79,70,229,0.5)]">
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shine pointer-events-none" />
      
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-white whitespace-nowrap overflow-hidden">
        
        {/* Simple Marquee for Mobile/Desktop */}
        <div className="flex animate-marquee-slower items-center gap-10">
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3" />
            <span>Frete Grátis para Fortaleza acima de R$ 300</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Ticket className="h-3 w-3" />
            <span>Use o cupom <span className="bg-white/20 px-1.5 py-0.5 rounded text-white ring-1 ring-white/30">TATTOO10</span> para 10% OFF</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3" />
            <span>Frete Grátis para Fortaleza acima de R$ 300</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Ticket className="h-3 w-3" />
            <span>Siga @shop.tattoo no Instagram</span>
          </div>
        </div>
      </div>

    </div>
  );
}
