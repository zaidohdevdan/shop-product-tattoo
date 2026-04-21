import React, { Suspense } from "react";
import { newsletterService } from "@/services/newsletter-service";
import { 
  Mail, 
  Users, 
  UserPlus, 
  Clock,
  Send,
  Calendar,
  CheckCircle2,
  Archive as ArchiveIcon
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SubscriptionStatus } from "@prisma/client";
import { NewsletterTabs } from "@/components/admin/NewsletterTabs";
import { NewsletterActions } from "@/components/admin/NewsletterActions";
import { CSVEmailExport } from "@/components/admin/CSVEmailExport";
import { AdminSearch } from "@/components/admin/AdminSearch";

interface PageProps {
  searchParams: Promise<{ tab?: string; query?: string }>;
}

/**
 * [PERF] Skeletons para carregamento fluido
 */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="premium-card h-32 animate-pulse bg-slate-50" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return <div className="premium-card h-[600px] animate-pulse bg-slate-50" />;
}

async function NewsletterDashboardContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ tab?: string; query?: string }> }) {
  const params = await searchParamsPromise;
  const tab = params.tab || "active";
  const query = params.query || "";
  const isArchivedTab = tab === "archived";
  const statusFilter = isArchivedTab ? SubscriptionStatus.ARCHIVED : SubscriptionStatus.ACTIVE;
  
  // Busca em paralelo
  const [subscriptions, stats] = await Promise.all([
    newsletterService.getSubscriptions(statusFilter, query),
    newsletterService.getStats()
  ]);

  return (
    <div className="space-y-10">
      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card p-6 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 tracking-tighter">{stats.total}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Total</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl" />
        </div>

        <div className="premium-card p-6 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 tracking-tighter">{stats.active}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inscritos Ativos</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl" />
        </div>

        <div className="premium-card p-6 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
              <ArchiveIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 tracking-tighter">{stats.archived}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Arquivados / Opt-out</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-amber-50/50 rounded-full blur-2xl" />
        </div>

        <div className="premium-card p-6 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 tracking-tighter">{stats.today}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Novos Hoje</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-rose-50/50 rounded-full blur-2xl" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
         <NewsletterTabs activeCount={stats.active} archivedCount={stats.archived} />
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <AdminSearch placeholder="Buscar por e-mail..." />
            <CSVEmailExport data={subscriptions.map(s => ({ email: s.email, createdAt: s.createdAt }))} />
         </div>
      </div>

      {/* Main Table View */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            {isArchivedTab ? "Lista de Arquivados" : "Lista de Transmissão Ativa"}
          </h2>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Sincronizado agora
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Inscrito</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-center">Data de Cadastro</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Mail className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Nenhuma inscrição localizada</p>
                     </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors">
                          <Mail className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <p className="text-sm font-bold text-zinc-900 lowercase tracking-tight">{sub.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {sub.status === SubscriptionStatus.ACTIVE ? (
                        <span className="executive-badge bg-emerald-50 text-emerald-700 border-emerald-100">ATIVO</span>
                      ) : (
                        <span className="executive-badge bg-slate-100 text-slate-500 border-slate-200">ARQUIVADO</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                        <p className="text-[11px] font-bold text-slate-500 uppercase">
                          {format(sub.createdAt, "dd/MM/yyyy, HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <NewsletterActions id={sub.id} status={sub.status} />
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterPage({ searchParams }: PageProps) {
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
            <Send className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Marketing & Leads</h1>
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Gestão de Inscritos na Newsletter
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="space-y-10">
          <StatsSkeleton />
          <TableSkeleton />
        </div>
      }>
        <NewsletterDashboardContent searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
