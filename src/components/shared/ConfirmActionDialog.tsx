"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[110] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-md w-full pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-4 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  <AlertTriangle className="h-8 w-8" />
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                  <div className="text-zinc-400 text-sm leading-relaxed">{description}</div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full mt-6">
                  <button
                    disabled={isPending}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    disabled={isPending}
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                      isDestructive 
                        ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                    }`}
                  >
                    {isPending ? "Aguarde..." : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
