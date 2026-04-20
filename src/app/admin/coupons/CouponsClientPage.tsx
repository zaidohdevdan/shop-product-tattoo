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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCoupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl p-6 transition-all hover:bg-zinc-900 hover:border-white/10"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {coupon.active ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <Check className="h-3 w-3" /> Ativo
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-[10px] font-black text-red-400 uppercase tracking-widest">
                  <X className="h-3 w-3" /> Inativo
                </span>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{coupon.code}</h3>
              </div>
              <p className="text-2xl font-black text-indigo-400">
                {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                <span className="text-[10px] text-zinc-500 font-bold uppercase ml-2 tracking-widest">OFF</span>
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Hash className="h-3.5 w-3.5 text-zinc-600" />
                Usos: <span className="text-white font-bold">{coupon.usedCount}</span> {coupon.maxUses ? `/ ${coupon.maxUses}` : "/ \u221E"}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                Expira: <span className="text-white font-bold">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("pt-BR") : "Nunca"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(coupon)}
                className="flex-1 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white gap-2 font-bold uppercase text-[10px] tracking-widest"
              >
                <Edit className="h-3 w-3" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(coupon.id)}
                className="rounded-xl border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 gap-2 font-bold uppercase text-[10px] tracking-widest"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {initialCoupons.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-zinc-600">
            <Ticket className="h-12 w-12 mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">Nenhum cupom criado ainda.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Ticket className="h-5 w-5 text-indigo-400" />
              </div>
              {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
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
