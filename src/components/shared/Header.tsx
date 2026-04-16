"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNav } from "./HeaderNav";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { CartButton } from "./CartButton";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Produtos", href: "/#products" },
  { name: "O Estúdio", href: "/#studio" },
  { name: "Depoimentos", href: "/#testimonials" },
];

export function Header() {
  const isScrolled = useHeaderScroll(20);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled
          ? "bg-[#020617]/70 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <HeaderLogo />

        <HeaderNav links={navLinks} />

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <CartButton />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <HeaderMobileMenu 
        id="mobile-menu"
        isOpen={isMobileMenuOpen} 
        links={navLinks} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}
