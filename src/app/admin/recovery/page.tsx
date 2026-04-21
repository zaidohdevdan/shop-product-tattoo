import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
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

// Server-side fetching
async function getAbandonedCarts() {
  return prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      customerPhone: { not: null },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export default async function RecoveryPage() {
  const carts = await getAbandonedCarts();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <ShoppingCart className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Recuperação de Vendas</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Monitorando {carts.length} carrinhos pendentes nas últimas 24h
            </p>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{carts.length}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aguardando Contato</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ExternalLink className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                R$ {carts.reduce((acc, c) => acc + Number(c.totalPrice), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Potencial de Recuperação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Cliente / Contato</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Itens no Carrinho</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Valor Total</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Data / Hora</th>
              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {carts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-zinc-600" />
                      </div>
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Nenhum carrinho abandonado encontrado</p>
                   </div>
                </td>
              </tr>
            ) : (
              carts.map((cart) => {
                const itemsList = cart.items.map(i => i.product.name).join(", ");
                const waMessage = encodeURIComponent(
                  `Olá ${cart.customerName}! 🎨\n\nSou do atendimento da *ShopTattoo*. Percebemos que você separou alguns equipamentos incríveis em nosso site but não finalizou o pedido:\n\n• ${itemsList}\n\nPosso te ajudar com o frete ou tirar alguma dúvida técnica para fecharmos hoje?`
                );
                const waLink = `https://wa.me/${cart.customerPhone?.replace(/\D/g, '')}?text=${waMessage}`;
                
                return (
                  <tr key={cart.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-colors">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{cart.customerName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Phone className="h-3 w-3 text-slate-600" />
                             <p className="text-[11px] font-bold text-slate-500">{cart.customerPhone}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="max-w-[240px]">
                        <p className="text-[11px] font-bold text-zinc-400 line-clamp-2 leading-relaxed">
                          {itemsList}
                        </p>
                        <p className="mt-1 text-[9px] font-black text-indigo-500/70 border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 rounded inline-block">
                          {cart.items.length} ITENS
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <p className="text-sm font-black text-white">
                          R$ {Number(cart.totalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                       </p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-600" />
                        <p className="text-xs font-bold text-zinc-500">
                          {format(cart.createdAt, "dd 'de' MMM, HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Pinguar Cliente
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
  );
}
