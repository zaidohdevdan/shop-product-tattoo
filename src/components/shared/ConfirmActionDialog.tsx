"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                  <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={onClose}
                    className="flex-1 rounded-xl font-bold text-sm text-zinc-400 hover:text-white"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={isDestructive ? "destructive" : "premium"}
                    disabled={isPending}
                    onClick={onConfirm}
                    className="flex-1 rounded-xl font-bold text-sm"
                  >
                    {isPending ? "Aguarde..." : confirmText}
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
