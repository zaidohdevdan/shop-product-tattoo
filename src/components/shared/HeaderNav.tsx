"use client";

import React from "react";
import Link from "next/link";
import { CartButton } from "./CartButton";

interface HeaderNavProps {
  links: Array<{ name: string; href: string }>;
}

export function HeaderNav({ links }: HeaderNavProps) {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-white hover:translate-y-[-1px] active:translate-y-[0px]"
        >
          {link.name}
        </Link>
      ))}
      <div className="h-4 w-px bg-white/10 mx-2" aria-hidden="true" />
      <CartButton />
    </nav>
  );
}
