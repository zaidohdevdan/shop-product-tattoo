"use client";

import React, { useState } from "react";
import { confirmOrderAction } from "@/actions/order-actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Package, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface OrderConfirmationFormProps {
  token: string;
  customerName: string;
  totalPrice: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
}

export function OrderConfirmationForm({ token, customerName, totalPrice, items, status }: OrderConfirmationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleAction = async (confirmed: boolean) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await confirmOrderAction(token, confirmed);
      if (response.error) {
        toast.error(response.error);
        setIsSubmitting(false);
      } else {
        setResult({ success: true, message: response.message || "Operação realizada com sucesso!" });
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Erro  ao processar a confirmação:" + error);
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <CheckCircle2 className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Status Atualizado!
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
          {result.message}
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl border-white/10">
            Voltar para a Loja
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Customer Info Card */}
      <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <User className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cliente</p>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{customerName}</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <span>Resumo do Pedido</span>
            <span>{items.length} itens</span>
          </div>
          
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-zinc-600" />
                  <span className="text-sm font-medium text-zinc-300">{item.name} <span className="text-indigo-400 ml-1 font-bold">({item.quantity}x)</span></span>
                </div>
                <span className="text-sm font-bold text-white">
                  R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-indigo-500/20 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor Total</p>
              <p className="text-3xl font-black text-indigo-400">
                R$ {totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Status: {status}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={() => handleAction(false)}
          disabled={isSubmitting}
          variant="outline"
          className="h-16 rounded-2xl border-white/5 bg-zinc-900/50 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 font-black uppercase tracking-widest gap-3 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Não Vendido
        </Button>
        <Button
          onClick={() => handleAction(true)}
          disabled={isSubmitting}
          className="h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest gap-3 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Venda
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
        Ao confirmar, o estoque será baixado automaticamente <br /> e o pedido marcado como concluído.
      </p>
    </div>
  );
}
