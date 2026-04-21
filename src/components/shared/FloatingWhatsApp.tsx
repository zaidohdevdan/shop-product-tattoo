"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useCartStore } from "@/lib/store/cart-store";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.045-5.413 12.048-12.049a11.85 11.85 0 00-3.535-8.416" stroke="none" />
  </svg>
);

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isCartOpen = useCartStore((state) => state.isOpen);

  useEffect(() => {
    if (isAdmin) return;

    // Show after 2s for better engagement
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Auto show tooltip briefly after button appears
      setTimeout(() => setShowTooltip(true), 1000);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const waNumber = "5585981025033";
  const message = encodeURIComponent("Olá! Estou no site e gostaria de tirar algumas dúvidas.");
  const url = `https://wa.me/${waNumber}?text=${message}`;

  if (isAdmin) return null;

  return (

    <div 
      className={cn(
        "fixed bottom-8 right-8 z-50 flex items-center transition-all duration-700",
        isVisible && !isCartOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      {/* Tooltip */}
      <div 
        className={cn(
          "mr-4 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-2xl transition-all duration-500 origin-right",
          showTooltip ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
      >
        <div className="relative">
          <span>Olá! Posso te ajudar? 👋</span>
          {/* Arrow */}
          <div className="absolute -right-5 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-white" />
        </div>
      </div>

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_-4px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_-4px_rgba(37,211,102,0.6)] active:scale-95"
      >
        {/* Pulse effect wrapper */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
        
        <WhatsAppIcon />
        
        {/* Notification Badge - Fake for conversion */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black group-hover:animate-bounce">
          1
        </span>
      </a>
    </div>
  );
}
