"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardRefresher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const lastRefreshRef = useRef<number>(0);

  useEffect(() => {
    const DEBOUNCE_MS = 30_000; // 30s
    lastRefreshRef.current = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastRefreshRef.current > DEBOUNCE_MS) {
          lastRefreshRef.current = now;
          startTransition(() => {
            router.refresh();
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  return (
    <div className={cn(
      "fixed top-6 right-10 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/80 backdrop-blur-md shadow-sm transition-all duration-500",
      isPending ? "border-indigo-200 scale-105" : "border-slate-200 opacity-60 hover:opacity-100"
    )}>
      {isPending ? (
        <Loader2 className="h-3 w-3 text-indigo-600 animate-spin" />
      ) : (
        <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
      )}
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest",
        isPending ? "text-indigo-600" : "text-slate-500"
      )}>
        {isPending ? "Atualizando..." : "Conectado"}
      </span>
      {!isPending && (
        <div className="flex gap-0.5 ml-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </div>
  );
}
