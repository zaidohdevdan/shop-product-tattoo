"use client";

import { useState } from "react";
import { saveCouponAction } from "@/actions/coupon-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Ticket, Calendar, ChevronDown } from "lucide-react";
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

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
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
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {coupon && <input type="hidden" name="id" value={coupon.id} />}
      
      <div className="space-y-6">
        {/* Code */}
        <div className="space-y-2.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
            Código do Cupom
          </label>
          <div className="relative">
            <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              name="code"
              type="text"
              required
              defaultValue={coupon?.code}
              placeholder="EX: PROMO10"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all uppercase font-black tracking-widest"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Value */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Valor do Desconto
            </label>
            <input
              name="discountValue"
              type="number"
              step="0.01"
              required
              defaultValue={coupon?.discountValue}
              placeholder="10.00"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all font-black"
            />
          </div>

          {/* Type */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Tipo de Desconto
            </label>
            <div className="relative">
              <select
                title="Tipo de Desconto"
                name="discountType"
                defaultValue={coupon?.discountType || "PERCENTAGE"}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500/50 transition-all font-black appearance-none"
              >
                <option value="PERCENTAGE">Porcentagem (%)</option>
                <option value="FIXED">Valor Fixo (R$)</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Max Uses */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Limite de Usos (0 = s/ limite)
            </label>
            <input
              title="Limite de Usos (0 = s/ limite)"
              name="maxUses"
              type="number"
              defaultValue={coupon?.maxUses || 0}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all font-black"
            />
          </div>

          {/* Expiration */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Data de Expiração
            </label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                title="Data de Expiração"
                name="expiresAt"
                type="date"
                defaultValue={coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : ""}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500/50 transition-all font-black"
              />
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-slate-100 transition-all hover:border-indigo-100 group">
          <input
            id="active"
            name="active"
            type="checkbox"
            value="true"
            defaultChecked={coupon ? coupon.active : true}
            className="h-5 w-5 rounded-lg border-slate-200 bg-white text-indigo-600 focus:ring-indigo-500/10 transition-all cursor-pointer"
          />
          <label htmlFor="active" className="text-[11px] font-black text-slate-400 uppercase tracking-widest cursor-pointer select-none group-hover:text-slate-600 transition-colors">
            Cupom Ativo & Monitorado
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-14 rounded-2xl border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-950/20 active:scale-95 transition-all text-[10px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            coupon ? "Salvar Alterações" : "Criar Cupom"
          )}
        </Button>
      </div>
    </form>
  );
}
