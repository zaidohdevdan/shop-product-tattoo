"use server";

export type NewsletterState = {
  success: boolean | null;
  message: string;
};

export async function subscribeToNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "E-mail inválido. Por favor, verifique e tente novamente.",
    };
  }

  try {
    // Simulação de delay de rede para demonstração do estado 'pending'
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Aqui você integraria com seu provedor de e-mail (Mailchimp, ConvertKit, etc.)
    console.log(`Newsletter subscription: ${email}`);

    return {
      success: true,
      message: "Bem-vindo à elite! Sua inscrição foi confirmada.",
    };
  } catch (error) {
    console.error("Newsletter Action Error:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao processar sua inscrição. Tente mais tarde.",
    };
  }
}
