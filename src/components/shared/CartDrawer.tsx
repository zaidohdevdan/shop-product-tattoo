"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle, Phone } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createOrderAction } from "@/actions/order-actions";
import { validateCouponAction } from "@/actions/coupon-actions";
import { toast } from "sonner";
import { Ticket, Percent, Tag as TagIcon } from "lucide-react";
import { syncCartAction } from "@/actions/cart-recovery-actions";
import { useDebounce } from "@/hooks/use-debounce";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const totalItems = useCartStore((state) => state.totalItems);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);
  const customerName = useCartStore((state) => state.customerName);
  const setCustomerName = useCartStore((state) => state.setCustomerName);
  const customerPhone = useCartStore((state) => state.customerPhone);
  const setCustomerPhone = useCartStore((state) => state.setCustomerPhone);
  const clearCart = useCartStore((state) => state.clearCart);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const WHATSAPP_NUMBER = "5585981025033";

  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, _hasHydrated]);

  // Debounced Sync for Abandoned Cart Recovery
  const debouncedName = useDebounce(customerName, 2000);
  const debouncedPhone = useDebounce(customerPhone, 2000);
  
  useEffect(() => {
    if (debouncedPhone.length >= 10 && items.length > 0) {
      syncCartAction(
        debouncedName || "Interesse Iniciado",
        debouncedPhone,
        items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
      );
    }
  }, [debouncedName, debouncedPhone, items]);

  if (!_hasHydrated) return null;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setIsValidatingCoupon(true);
    try {
      const result = await validateCouponAction(couponInput.trim());
      if (result.error) {
        toast.error(result.error);
        setCouponInput("");
      } else if (result.success && result.coupon) {
        applyCoupon(result.coupon);
        toast.success(`Cupom "${result.coupon.code}" aplicado com sucesso!`);
        setCouponInput("");
      }
    } catch (error) {
      toast.error("Erro ao validar cupom:"+ error);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;

    if (!customerName.trim()) {
      toast.error("Por favor, informe seu nome para continuar.");
      document.getElementById("customer-name")?.focus();
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 10) {
      toast.error("Por favor, informe um WhatsApp válido.");
      document.getElementById("customer-phone")?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Criar o pedido no banco e validar estoque no servidor
      const result = await createOrderAction(
        customerName.trim(),
        items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        appliedCoupon?.code
      );

      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      // 2. Construir mensagem do WhatsApp com o link de confirmação do vendedor
      const confirmationLink = `${window.location.origin}/confirm-order/${result.sellerToken}`;
      
      const messageHeader = `Olá! Meu nome é *${customerName.trim()}* e gostaria de fazer um pedido:\n\n`;
      const itemsList = items
        .map(
          (item) =>
            `• ${item.name} (${item.quantity}x) - R$ ${(
              item.price * item.quantity
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        )
        .join("\n");
        
      const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      let messageFooter = `\n\n*Total: R$ ${totalPrice().toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}*`;

      if (appliedCoupon) {
        const discountLabel = appliedCoupon.discountType === "PERCENTAGE" 
          ? `(${appliedCoupon.discountValue}%)` 
          : `(R$ ${appliedCoupon.discountValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`;
        
        messageFooter = `\n\nSubtotal: R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}\nCupom: ${appliedCoupon.code} ${discountLabel}\n*Total Final: R$ ${totalPrice().toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}*`;
      }
      
      const sellerInfo = `\n\n--- 🔐 ÁREA DO VENDEDOR ---\n\nConfirme este pedido aqui:\n\n${confirmationLink}\n\n`;
      
      const fullMessage = messageHeader + itemsList + messageFooter + sellerInfo;
      
      // Detectar se é mobile ou desktop para otimizar o link do WhatsApp
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
      
      let whatsappUrl = "";
      if (isMobile) {
        whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
      } else {
        // Formato correto para o WhatsApp Web (Desktop)
        // Usar api.whatsapp.com como fallback seguro que detecta o ambiente
        whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(fullMessage)}`;
      }
      
      // 3. Limpar carrinho e fechar IMEDIATAMENTE antes de sair da página
      clearCart();
      setOpen(false);
      setIsSubmitting(false);

      // No desktop, redirecionar na mesma aba ajuda a focar no WhatsApp Web
      if (!isMobile) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, "_blank");
      }

    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error("Ocorreu um erro ao processar seu pedido.");
      setIsSubmitting(false);
    }
  };

  // Helper for masking phone input (simple)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomerPhone(value);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal - totalPrice();

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
            className="fixed inset-0 z-[60] bg-[#020617]/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            id="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-[#020617] p-0 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="flex h-full flex-col relative overflow-hidden">
              {/* Theme Art Background */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <Image
                  src="/images/theme/footer-bg.png"
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-[#020617]/80" />
              </div>
              
              <div className="relative z-10 flex h-full flex-col w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 p-6 bg-[#020617]/50 backdrop-blur-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                      <ShoppingBag className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 id="cart-title" className="text-xl font-black uppercase tracking-tight text-white">
                        Seu Carrinho
                      </h2>
                      <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">
                        {totalItems()} equipamentos
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Fechar carrinho"
                    onClick={() => setOpen(false)}
                    className="rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center px-4">
                      <div className="relative mb-8">
                        <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                          <ShoppingBag className="h-10 w-10 text-slate-500" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">O carrinho está vazio</h3>
                      <p className="mt-2 max-w-xs text-sm text-slate-400 font-medium">
                        Explore nossos produtos e adicione os melhores equipamentos ao seu kit.
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="mt-8 border-white/10 text-white bg-transparent hover:bg-white/5 rounded-2xl"
                        onClick={() => setOpen(false)}
                      >
                        Continuar Comprando
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="group relative flex gap-4 p-3 rounded-2xl border border-white/5 hover:border-white/2 hover:bg-white/2 transition-all">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-white/5 shadow-sm">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between py-0.5">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                  {item.name}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`Remover ${item.name} do carrinho`}
                                  onClick={() => setItemToRemove(item.id)}
                                  className="h-8 w-8 p-0 text-slate-600 hover:text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                SKU: {item.sku}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-black/40 p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-6 w-6 p-0 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20"
                                  disabled={item.quantity <= 1}
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs font-black text-white">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-6 w-6 p-0 text-slate-400 hover:bg-white/10 hover:text-white"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm font-black text-white">
                                R$ {(item.price * item.quantity).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Coupon Section */}
                      <div className="mt-8 p-4 rounded-2xl bg-white/2 border border-white/5 font-primary">
                        <div className="flex items-center gap-2 mb-3">
                          <Ticket className="h-4 w-4 text-indigo-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Cupom de Desconto</h4>
                        </div>
                        
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                            <div className="flex items-center gap-2">
                              <TagIcon className="h-4 w-4 text-indigo-400" />
                              <span className="text-sm font-bold text-white uppercase tracking-tight">{appliedCoupon.code}</span>
                              <span className="text-[10px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                {appliedCoupon.discountType === "PERCENTAGE" ? `${appliedCoupon.discountValue}% OFF` : `R$ ${appliedCoupon.discountValue} OFF`}
                              </span>
                            </div>
                            <button 
                              onClick={removeCoupon}
                              className="text-zinc-500 hover:text-white transition-colors"
                              title="Remover cupom"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Código do cupom"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500/50 transition-all font-bold tracking-wider"
                            />
                            <Button
                              onClick={handleApplyCoupon}
                              disabled={!couponInput.trim() || isValidatingCoupon}
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-white/10 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest px-4 h-11"
                            >
                              {isValidatingCoupon ? "..." : "Aplicar"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-white/5 bg-black/40 p-6 backdrop-blur-2xl">
                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="customer-name" className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">
                            Seu Nome *
                          </label>
                          <input
                            id="customer-name"
                            type="text"
                            placeholder="Como te chamamos?"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/10 transition-all font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="customer-phone" className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">
                            WhatsApp *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                              <Phone className="h-3.5 w-3.5 text-indigo-400" />
                            </span>
                            <input
                              id="customer-phone"
                              type="tel"
                              placeholder="(00) 00000-0000"
                              value={customerPhone}
                              onChange={handlePhoneChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/10 transition-all font-bold"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}</span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex items-center justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-md">
                          <span className="flex items-center gap-1.5"><Percent className="h-3 w-3" /> Desconto ({appliedCoupon.code})</span>
                          <span>- R$ {discount.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-white uppercase tracking-tight">Total Geral</span>
                        <span className="text-2xl font-black text-indigo-400">
                          R$ {totalPrice().toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="premium"
                      size="lg"
                      className="w-full gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      aria-label="Finalizar pedido pelo WhatsApp"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Processando...
                        </span>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5 fill-current" />
                          Finalizar via WhatsApp
                        </>
                      )}
                    </Button>
                    <p className="mt-4 text-center text-[9px] text-slate-600 uppercase tracking-widest font-black">
                      Consulte frete e prazos no atendimento
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Remove Confirmation Dialog */}
          <AnimatePresence>
            {itemToRemove && (
              <motion.div
                key="remove-dialog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 px-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 10 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
                  role="alertdialog"
                  aria-labelledby="remove-title"
                  aria-describedby="remove-description"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 id="remove-title" className="text-center text-lg font-black text-white uppercase tracking-tight">
                    Remover do pedido?
                  </h3>
                  <p id="remove-description" className="mt-3 text-center text-sm font-medium text-slate-400 leading-relaxed">
                    Tem certeza que deseja retirar este equipamento do seu carrinho?
                  </p>
                  
                  <div className="mt-8 flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setItemToRemove(null)}
                      className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold"
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        removeItem(itemToRemove);
                        setItemToRemove(null);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/20"
                    >
                      Remover
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
