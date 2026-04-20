"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, Settings, LogOut, Menu, X, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth-actions";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tag },
  { href: "/admin/coupons", label: "Cupons", icon: Ticket },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="flex md:hidden h-20 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg shadow-lg" />
          <span className="text-base font-black uppercase tracking-tighter text-white">
            Shop<span className="text-indigo-500">Admin</span>
          </span>
        </Link>
        <button
          type="button"
          title="Abrir Menu"
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* MOBILE OVERLAY DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-white/5 z-[70] flex flex-col p-6 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                  <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-xl shadow-lg shadow-indigo-500/20" />
                  <span className="text-lg font-black uppercase tracking-tighter text-white">
                    Shop<span className="text-indigo-500">Admin</span>
                  </span>
                </Link>
                <button
                  title="Fechar Menu"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-zinc-500 bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-bold transition-all",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <form action={logoutAction} className="mt-auto pt-6 border-t border-white/5">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-red-500/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  Encerrar Sessão
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex h-screen w-72 flex-col border-r border-white/5 bg-zinc-950 p-6 sticky top-0 shrink-0">
        <Link href="/" className="mb-14 flex items-center gap-3 px-2 transition-transform hover:scale-105">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-xl shadow-lg shadow-indigo-500/20" />
          <span className="text-xl font-black uppercase tracking-tighter text-white">
            Shop<span className="text-indigo-500">Admin</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all group",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 translate-x-1"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 hover:translate-x-1"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="mt-auto pt-6 border-t border-white/5">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-red-500/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Encerrar Sessão
          </button>
        </form>
      </div>
    </>
  );
}
