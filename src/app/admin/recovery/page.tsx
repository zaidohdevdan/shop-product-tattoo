import React, { Suspense } from "react";
import { recoveryService } from "@/services/recovery-service";
import { 
  MessageSquare, 
  ShoppingCart, 
  Clock, 
  User, 
  AlertCircle,
  ExternalLink,
  Phone
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * [PERF] Skeleton para os cards de estatísticas
 */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="premium-card h-32 animate-pulse bg-slate-50" />
      ))}
    </div>
  );
}

/**
 * [PERF] Skeleton para a tabela
 */
function TableSkeleton() {
  return <div className="premium-card h-[600px] animate-pulse bg-slate-50" />;
}

async function RecoveryDashboardContent() {
  const carts = await recoveryService.getAbandonedCarts();

  return (
    <div className="space-y-10">
      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="premium-card p-8 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-zinc-900 tracking-tighter">{carts.length}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando Contato</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl" />
        </div>
        
        <div className="premium-card p-8 group overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
              <ExternalLink className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                R$ {carts.reduce((acc, c) => acc + c.totalPrice, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potencial de Recuperação</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-emerald-50/50 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Main Table View */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Relatório de Carrinhos Abandonados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Cliente / Contato</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Itens no Carrinho</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Valor Total</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Data / Hora</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {carts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <ShoppingCart className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Nenhum carrinho pendente</p>
                     </div>
                  </td>
                </tr>
              ) : (
                carts.map((cart) => {
                  const itemsList = cart.items.map(i => i.productName).join(", ");
                  const waMessage = encodeURIComponent(
                    `Olá ${cart.customerName}! 🎨\n\nSou do atendimento da *ShopTattoo*. Percebemos que você separou alguns equipamentos incríveis em nosso site mas não finalizou o pedido:\n\n• ${itemsList}\n\nPosso te ajudar com o frete ou tirar alguma dúvida técnica para fecharmos hoje?`
                  );
                  const waLink = `https://wa.me/${cart.customerPhone?.replace(/\D/g, '')}?text=${waMessage}`;
                  
                  return (
                    <tr key={cart.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors">
                            <User className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{cart.customerName}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                               <Phone className="h-3 w-3 text-slate-400" />
                               <p className="text-[11px] font-bold text-slate-500">{cart.customerPhone}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="max-w-[280px]">
                          <p className="text-[11px] font-bold text-slate-600 line-clamp-2 leading-relaxed">
                            {itemsList}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                             <div className="executive-badge bg-indigo-50 text-indigo-600 border-indigo-100">
                                {cart.items.length} ITENS
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                         <p className="text-base font-black text-zinc-900 tracking-tight">
                            R$ {cart.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                         </p>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-2.5">
                          <Clock className="h-4 w-4 text-slate-300" />
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                            {format(cart.createdAt, "dd 'de' MMM, HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Recuperar Venda
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function RecoveryPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-700">
      {/* Header Area — Renderizado Imediatamente */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Recuperação de Vendas</h1>
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Monitorando carrinhos pendentes nas últimas 24h
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico — Streaming com Suspense */}
      <Suspense fallback={
        <div className="space-y-10">
          <StatsSkeleton />
          <TableSkeleton />
        </div>
      }>
        <RecoveryDashboardContent />
      </Suspense>
      
      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-relaxed pt-10">
        Dashboard Executivo de Inteligência Comercial <br /> — ShopTattoo Supply System —
      </p>
    </div>
  );
}
