"use server";

import { newsletterService } from "@/services/newsletter-service";
import { revalidateTag } from "next/cache";

export type NewsletterState = {
  success: boolean | null;
  message: string;
};

export async function subscribeToNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "E-mail inválido. Por favor, verifique e tente novamente.",
    };
  }

  try {
    await newsletterService.subscribe(email);
    
    return {
      success: true,
      message: "Bem-vindo à elite! Sua inscrição foi confirmada.",
    };
  } catch (error) {
    console.error("Newsletter Action Error:", error);
    const errorMessage = error instanceof Error ? error.message: "Ocorreu um erro ao processar sua inscrição. Tente mais tarde."
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Ações Administrativas
 */

export async function archiveNewsletterAction(id: string) {
  try {
    await newsletterService.archiveSubscription(id);
    revalidateTag("subscriptions", 'max');
    return { success: true };
  } catch{
    return { error: "Erro ao arquivar inscrição" };
  }
}

export async function unarchiveNewsletterAction(id: string) {
  try {
    await newsletterService.unarchiveSubscription(id);
    revalidateTag("subscriptions", 'max');
    return { success: true };
  } catch {
    return { error: "Erro ao desarquivar inscrição" };
  }
}

export async function deleteNewsletterAction(id: string) {
  try {
    await newsletterService.deleteSubscription(id);
    revalidateTag("subscriptions", "max");
    return { success: true };
  } catch  {
    return { error: "Erro ao deletar inscrição" };
  }
}
