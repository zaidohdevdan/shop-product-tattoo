"use client";

import React, { useTransition, useRef } from "react";
import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await loginAction(formData);
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          alert("Senha incorreta.");
        }
        formRef.current?.reset();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-[2rem] border border-white/5 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
          <LockKeyhole className="h-8 w-8 text-indigo-500" />
        </div>
        
        <h1 className="mb-2 text-center text-2xl font-black text-white relative z-10">
          Acesso Restrito
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-500 relative z-10">
          Área de gestão. Informe a chave mestra para continuar.
        </p>

        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <input
            type="password"
            name="password"
            placeholder="Senha..."
            required
            className="h-14 rounded-xl border border-white/10 bg-black/50 px-5 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
          />
          <Button 
            type="submit" 
            disabled={isPending}
            className="h-14 w-full rounded-xl bg-indigo-600 font-bold hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
          >
            {isPending ? "Validando Chave..." : "Desbloquear Acesso"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
