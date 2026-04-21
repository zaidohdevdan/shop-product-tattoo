import { format } from "date-fns";
import { ArrowUpRight, TrendingUp } from "lucide-react";

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
      <div className="premium-card p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-6 font-black text-slate-300">
           ?
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Nenhuma venda recente localizada</p>
      </div>
    );
  }

  return (
    <div className="premium-card p-10 h-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Vendas Recentes</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-60">Monitoramento em tempo real</p>
        </div>
        <button type="button" title="Ver todas as vendas" className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-zinc-900 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificador</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Líquido</th>
              <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                      <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">#{order.id.slice(-6)}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(order.createdAt), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <p className="text-xs font-black text-slate-900 tracking-tight">R$ {Number(order.totalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Aprovado
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
