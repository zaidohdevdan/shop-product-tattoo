"use client";

import React, { useState } from "react";
import { saveCouponAction } from "@/actions/coupon-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Ticket, Calendar } from "lucide-react";
import { CouponType } from "@prisma/client";

interface CouponFormProps {
  coupon?: {
    id: string;
    code: string;
    discountValue: number;
    discountType: CouponType;
    maxUses: number | null;
    expiresAt: Date | null;
    active: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, onSuccess, onCancel }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await saveCouponAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(coupon ? "Cupom atualizado!" : "Cupom criado!");
        onSuccess();
      }
    } catch (error) {
      toast.error("Erro ao salvar cupom:" + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {coupon && <input type="hidden" name="id" value={coupon.id} />}
      
      <div className="space-y-4">
        {/* Code */}
        <div>
          <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
            Código do Cupom
          </label>
          <div className="relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              name="code"
              type="text"
              required
              defaultValue={coupon?.code}
              placeholder="EX: PROMO10"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500/50 transition-all uppercase font-bold tracking-widest"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Value */}
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Valor do Desconto
            </label>
            <input
              name="discountValue"
              type="number"
              step="0.01"
              required
              defaultValue={coupon?.discountValue}
              placeholder="10.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500/50 transition-all font-bold"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Tipo de Desconto
            </label>
            <select
              title="Tipo de Desconto"
              name="discountType"
              defaultValue={coupon?.discountType || "PERCENTAGE"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-indigo-500/50 transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="PERCENTAGE" className="bg-zinc-900">Porcentagem (%)</option>
              <option value="FIXED" className="bg-zinc-900">Valor Fixo (R$)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Max Uses */}
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Limite de Usos (0 = s/ limite)
            </label>
            <input
              title="Limite de Usos (0 = s/ limite)"
              name="maxUses"
              type="number"
              defaultValue={coupon?.maxUses || 0}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500/50 transition-all font-bold"
            />
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Data de Expiração
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                title="Data de Expiração"
                name="expiresAt"
                type="date"
                defaultValue={coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-hidden focus:border-indigo-500/50 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/2 border border-white/5">
          <input
            id="active"
            name="active"
            type="checkbox"
            value="true"
            defaultChecked={coupon ? coupon.active : true}
            className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/20"
          />
          <label htmlFor="active" className="text-sm font-bold text-zinc-300">
            Cupom Ativo
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 rounded-2xl border-white/5 bg-white/2 text-zinc-400 hover:text-white"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            coupon ? "Salvar Alterações" : "Criar Cupom"
          )}
        </Button>
      </div>
    </form>
  );
}
