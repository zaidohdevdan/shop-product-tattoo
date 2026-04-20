"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CouponType } from "@prisma/client";

/**
 * Valida um cupom e retorna seus detalhes se estiver ativo e válido.
 */
export async function validateCouponAction(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { error: "Cupom inválido ou não encontrado." };
    }

    if (!coupon.active) {
      return { error: "Este cupom não está mais ativo." };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { error: "Este cupom expirou." };
    }

    if (coupon.maxUses && coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return { error: "Este cupom atingiu o limite de usos." };
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountValue: Number(coupon.discountValue),
        discountType: coupon.discountType,
      },
    };
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return { error: "Ocorreu um erro ao validar o cupom." };
  }
}

/**
 * (Admin) Cria ou atualiza um cupom
 */
export async function saveCouponAction(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const code = (formData.get("code") as string).toUpperCase();
    const discountValue = parseFloat(formData.get("discountValue") as string);
    const discountType = formData.get("discountType") as CouponType;
    const maxUses = parseInt(formData.get("maxUses") as string) || 0;
    const expiresAtRaw = formData.get("expiresAt") as string;
    const active = formData.get("active") === "true";

    if (!code || isNaN(discountValue)) {
      return { error: "Campos obrigatórios ausentes ou inválidos." };
    }

    const data = {
      code,
      discountValue,
      discountType,
      maxUses,
      active,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    };

    if (id) {
      await prisma.coupon.update({
        where: { id },
        data,
      });
    } else {
      await prisma.coupon.create({
        data,
      });
    }

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar cupom:", error);
    return { error: "Erro ao salvar cupom. Verifique se o código já existe." };
  }
}

/**
 * (Admin) Remove um cupom
 */
export async function deleteCouponAction(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar cupom:", error);
    return { error: "Erro ao deletar cupom." };
  }
}
