"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * DevCacheReset
 * 
 * Um componente utilitário que só aparece em ambiente de desenvolvimento.
 * Permite limpar Service Workers, LocalStorage e Cache do navegador
 * para resolver problemas de persistência de dados durante o dev.
 */
export function DevCacheReset() {
  const [isVisible, setIsVisible] = useState(false);

  // Só mostra em localhost/desenvolvimento
  useEffect(() => {
    const checkVisibility = () => {
      if (
        process.env.NODE_ENV === "development" || 
        window.location.hostname === "localhost" || 
        window.location.hostname === "127.0.0.1"
      ) {
        setIsVisible(true);
      }
    };
    
    // Resolve synchronously but outside the immediate effect execution to avoid React 19 warnings
    Promise.resolve().then(checkVisibility);
  }, []);

  if (!isVisible) return null;

  const resetAll = async () => {
    try {
      // 1. Desregistrar Service Workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Limpar Caches da API de Cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }

      // 3. Limpar Storage
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Cache e Service Workers limpos com sucesso!");
      
      // 4. Reload forçado
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast.error("Falha ao limpar o cache.");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 opacity-20 hover:opacity-100 transition-opacity">
      <button
        onClick={resetAll}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg transition-all active:scale-95"
        title="Limpar SW, LocalStorage e Caches (Dev Only)"
      >
        <Trash2 className="w-3 h-3" />
        <span>Limpar Cache Dev</span>
      </button>
      
      <div className="flex gap-1 justify-center">
         <span className="bg-slate-800 text-[10px] text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
           DEV MODE
         </span>
      </div>
    </div>
  );
}
