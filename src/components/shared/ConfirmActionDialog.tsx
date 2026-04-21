"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isPending?: boolean;
}

export function ConfirmActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true,
  isPending = false,
}: ConfirmActionDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isPending ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] max-w-md w-full pointer-events-auto relative overflow-hidden"
            >
              {/* Premium Glow Effect */}
              <div className="absolute -top-24 -right-24 h-48 w-48 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col items-center text-center gap-8 relative z-10">
                <div className={`h-20 w-20 rounded-[1.5rem] flex items-center justify-center shadow-inner ${isDestructive ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                  <AlertTriangle className="h-10 w-10 animate-in zoom-in duration-500" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{title}</h3>
                  <div className="text-slate-500 text-[13px] font-medium leading-relaxed px-2">
                    {description}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 w-full mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={onClose}
                    title="Cancelar esta ação"
                    className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-black uppercase text-[11px] tracking-widest transition-all"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={onConfirm}
                    title="Confirmar e prosseguir"
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl",
                      isDestructive 
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-100" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100"
                    )}
                  >
                    {isPending ? "Processando..." : confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
