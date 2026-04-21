"use server";

import { recoveryService } from "@/services/recovery-service";
import { revalidateTag } from "next/cache";

export async function archiveRecoveryAction(id: string) {
  try {
    await recoveryService.archiveRecoveryOrder(id);
    revalidateTag("orders", "max");
    return { success: true };
  } catch {
    return { error: "Erro ao arquivar lead de recuperação" };
  }
}

export async function unarchiveRecoveryAction(id: string) {
  try {
    await recoveryService.unarchiveRecoveryOrder(id);
    revalidateTag("orders", "max");
    return { success: true };
  } catch {
    return { error: "Erro ao desarquivar lead de recuperação" };
  }
}

export async function deleteRecoveryAction(id: string) {
  try {
    await recoveryService.deleteRecoveryOrder(id);
    revalidateTag("orders", "max");
    return { success: true };
  } catch {
    return { error: "Erro ao deletar lead de recuperação" };
  }
}
