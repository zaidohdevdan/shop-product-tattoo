"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardRefresher() {
  const router = useRouter();

  useEffect(() => {
    // Refresh the page data every 30 seconds to keep the dashboard in sync
    // with sales confirmed on other devices (e.g., cell phones via WhatsApp)
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
