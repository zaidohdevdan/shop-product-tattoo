"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { subscribeToNewsletterAction, NewsletterState } from "@/actions/newsletter-actions";

const initialState: NewsletterState = {
  success: null,
  message: "",
};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletterAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success === true) {
      toast.success("Bem-vindo à elite!", {
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.success === false) {
      toast.error("Ops! Algo deu errado.", {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-3">
      <input 
        type="email" 
        name="email"
        placeholder="Seu melhor e-mail" 
        className="h-14 flex-1 rounded-xl border border-white/10 bg-white/5 px-6 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-all"
        required
        disabled={isPending}
      />
      <button 
        type="submit"
        disabled={isPending}
        className="h-14 min-w-[140px] flex items-center justify-center rounded-xl bg-indigo-600 px-8 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Inscrever"
        )}
      </button>
    </form>
  );
}
