"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Calendar, Hash, Check, X, Ticket } from "lucide-react";
import { CouponForm } from "@/components/admin/coupons/CouponForm";
import { deleteCouponAction } from "@/actions/coupon-actions";
import { toast } from "sonner";
import { CouponType } from "@prisma/client";

interface Coupon {
  id: string;
  code: string;
  discountValue: number;
  discountType: CouponType;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: Date | null;
}

interface CouponsClientPageProps {
  initialCoupons: Coupon[];
}

export function CouponsClientPage({ initialCoupons }: CouponsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    
    try {
      const result = await deleteCouponAction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Cupom excluído com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao excluir cupom:"+ error);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCoupon(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button
          onClick={handleAddNew}
          className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest gap-2 animate-in fade-in slide-in-from-right-4"
        >
          <Plus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialCoupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className="premium-card p-10 flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm relative"
          >
            {/* Status Badge */}
            <div className="absolute top-8 right-8">
              {coupon.active ? (
                <span className="executive-badge bg-emerald-50 text-emerald-700 border-emerald-100">
                  <Check className="h-3 w-3 mr-1" /> Ativo
                </span>
              ) : (
                <span className="executive-badge bg-rose-50 text-rose-700 border-rose-100">
                  <X className="h-3 w-3 mr-1" /> Inativo
                </span>
              )}
            </div>

            {/* Content */}
            <div className="mb-10 pt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                  <Ticket className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{coupon.code}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-indigo-600 tracking-tighter">
                  {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                </p>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">OFF</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="h-3.5 w-3.5 opacity-40" />
                  Consumo
                </div>
                <span className="text-slate-600">
                  <span className="text-slate-900 font-black">{coupon.usedCount}</span> {coupon.maxUses ? `/ ${coupon.maxUses}` : "/ \u221E"} <span className="opacity-40">USOS</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-3.5 w-3.5 opacity-40" />
                  Validade
                </div>
                <span className="text-slate-600">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("pt-BR") : "ILIMITADO"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(coupon)}
                className="flex-1 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest transition-all"
              >
                <Edit className="h-4 w-4" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(coupon.id)}
                className="h-12 w-12 rounded-xl border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center p-0"
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Ticket className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                {editingCoupon ? "Revisar Cupom" : "Novo Registro"}
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configuração de Desconto</p>
              </div>
            </h2>
            
            <CouponForm 
              coupon={editingCoupon}
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
