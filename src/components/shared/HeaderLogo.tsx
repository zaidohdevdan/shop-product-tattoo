"use client";

import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-indigo-500/10 p-0.5 transition-transform group-hover:scale-105 group-active:scale-95 shadow-lg shadow-indigo-500/10">
        <Image 
          src="/logo.png" 
          alt="ShopTattoo Logo" 
          width={40} 
          height={40} 
          className="rounded-lg object-cover" 
          priority
        />
      </div>
      <span className="text-xl font-black uppercase tracking-tighter text-white">
        Shop<span className="text-indigo-500 transition-colors group-hover:text-indigo-400">Tattoo</span>
      </span>
    </Link>
  );
}
