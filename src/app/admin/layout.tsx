import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard - ShopTattoo",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative h-[calc(100vh-80px)] md:h-screen w-full">
        {children}
      </main>
    </div>
  );
}
