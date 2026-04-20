import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Calendar, ArrowUpRight } from "lucide-react";

interface RecentOrder {
  id: string;
  customerName: string;
  totalPrice: number | string | { toNumber(): number };
  createdAt: Date | string;
}

interface RecentSalesProps {
  orders: RecentOrder[];
}

export function RecentSales({ orders }: RecentSalesProps) {
  if (orders.length === 0) {
    return (
      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/50 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Nenhuma venda confirmada recente</p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Vendas Recentes</h2>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">Últimos pedidos confirmados</p>
        </div>
        <button type="button" title="Ver todas as vendas" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                  {order.customerName}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(order.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-white px-3 py-1 rounded-lg bg-zinc-900 border border-white/5">
                R$ {Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.1em] mt-1.5 opacity-80">
                Confirmado
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
