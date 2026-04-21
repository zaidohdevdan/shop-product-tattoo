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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-slate-900 selection:bg-indigo-600 selection:text-white overflow-hidden font-sans antialiased">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative h-[calc(100vh-80px)] md:h-screen w-full bg-slate-100/50">
        {children}
      </main>
    </div>
  );
}
