"use client";

import React, { ReactNode } from "react";
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isPending ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[110] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-2xl max-w-md w-full pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${isDestructive ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                  <AlertTriangle className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
                  <div className="text-slate-500 text-xs font-medium leading-relaxed px-4">{description}</div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full mt-4">
                  <Button
                    variant="outline"
                    disabled={isPending}
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={onConfirm}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg",
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
    </AnimatePresence>
  );
}
