"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5585981025033";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleCheckout = () => {
    const messageHeader = "Olá! Gostaria de fazer um pedido:\n\n";
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} (${item.quantity}x) - R$ ${(
            item.price * item.quantity
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      )
      .join("\n");
    const messageFooter = `\n\n*Total: R$ ${totalPrice().toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}*`;
    
    const fullMessage = messageHeader + itemsList + messageFooter;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      fullMessage
    )}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-black p-0 shadow-2xl"
          >
            <div className="flex h-full flex-col relative overflow-hidden">
              {/* Theme Art Background */}
              <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
                <Image
                  src="/images/theme/footer-bg.png"
                  alt="Cart Theme Texture"
                  fill
                  className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/80" />
              </div>
              
              <div className="relative z-10 flex h-full flex-col w-full">
                {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-indigo-500" />
                  <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/60">
                    {totalItems()} itens
                  </span>
                </div>
                <button
                  type="button"
                  title="Fechar carrinho"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-white/5 p-6">
                      <ShoppingBag className="h-12 w-12 text-white/20" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-white">O carrinho está vazio</h3>
                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                      Explore nossos produtos e adicione os melhores equipamentos ao seu kit.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 border-white/10 text-white bg-transparent hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="group relative flex gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-bold text-white line-clamp-1">
                                {item.name}
                              </h4>
                              <button
                                type="button"
                                title="Remover Item"
                                onClick={() => setItemToRemove(item.id)}
                                className="text-zinc-600 transition-colors hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mt-1 text-xs font-medium text-zinc-500">
                              SKU: {item.sku}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-1">
                              <button
                                type="button"
                                onClick= {() => updateQuantity(item.id, item.quantity - 1)}
                                className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                                disabled={item.quantity <= 1}
                                title="Diminuir quantidade"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-4 text-center text-xs font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                                title="Aumentar quantidade"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-white">
                              R$ {(item.price * item.quantity).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-white/5 bg-white/2 p-6 backdrop-blur-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-zinc-400 font-medium">Subtotal</span>
                    <span className="text-xl font-black text-white">
                      R$ {totalPrice().toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-3 group"
                    onClick={handleCheckout}
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    Finalizar Pedido via WhatsApp
                  </Button>
                  <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                    Frete e prazos calculados no atendimento
                  </p>
                </div>
              )}

              {/* Remove Confirmation Dialog */}
              <AnimatePresence>
                {itemToRemove && (
                  <motion.div
                    key="remove-dialog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 10 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                    >
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                        <Trash2 className="h-6 w-6 text-red-500" />
                      </div>
                      <h3 className="text-center text-lg font-bold text-white">
                        Remover do pedido?
                      </h3>
                      <p className="mt-2 text-center text-sm text-zinc-400">
                        Você tem certeza que quer remover este item do seu carrinho?
                      </p>
                      
                      <div className="mt-8 flex gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => setItemToRemove(null)}
                          className="flex-1 text-white hover:bg-white/5"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            removeItem(itemToRemove);
                            setItemToRemove(null);
                          }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                        >
                          Remover
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
