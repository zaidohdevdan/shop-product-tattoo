"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderMobileMenuProps {
  id?: string;
  isOpen: boolean;
  links: Array<{ name: string; href: string }>;
  onClose: () => void;
}

export function HeaderMobileMenu({ id, isOpen, links, onClose }: HeaderMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute left-0 right-0 top-full overflow-hidden bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 md:hidden"
        >
          <div className="flex flex-col gap-4 p-8">
            {links.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-2xl font-black uppercase tracking-tighter text-slate-400 active:text-white flex items-center justify-between"
                >
                  {link.name}
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-0 transition-opacity group-active:opacity-100" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
