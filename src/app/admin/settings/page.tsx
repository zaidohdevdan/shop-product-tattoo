import React from 'react';
import { Shield, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto space-y-10 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Configurações Globais</h1>
          </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Parametrização operacional e comportamento da loja</p>
      </div>

      <div className="grid gap-8">
        <div className="bg-white p-10 flex flex-col md:flex-row gap-8 items-start group border border-slate-100 rounded-[2rem] shadow-sm">
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 transition-all duration-500 group-hover:scale-110 shadow-sm">
            <Server className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="flex-1">
             <h3 className="text-slate-900 font-black text-xl mb-3 uppercase tracking-tight">Comunicação Direta <span className="text-indigo-600">(WhatsApp Business)</span></h3>
             <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">
               A integração com WhatsApp está configurada para rotear pedidos diretamente para o seu canal de atendimento. 
               O sistema garante que as rotas de checkout sejam processadas de forma segura e imediata, 
               conectando seus clientes ao vendedor de forma automatizada.
             </p>
             <div className="flex gap-3">
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Gateway Ativo</span>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-10 flex flex-col md:flex-row gap-8 items-start group border border-slate-100 rounded-[2rem] shadow-sm">
          <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100 transition-all duration-500 group-hover:scale-110 shadow-sm">
            <Shield className="h-8 w-8 text-violet-600" />
          </div>
          <div className="flex-1">
             <h3 className="text-slate-900 font-black text-xl mb-3 uppercase tracking-tight">Segurança de Acesso <span className="text-violet-600">(Painel Administrativo)</span></h3>
             <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">
               Seu painel de controle é protegido por camadas de autenticação servidora. Para manter a integridade dos dados 
               da loja, as credenciais administrativas são gerenciadas e rotacionadas através das configurações do servidor, 
               garantindo que apenas pessoal autorizado possa realizar mudanças críticas.
             </p>
             <div className="flex gap-3">
               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  <span className="text-[10px] font-black uppercase tracking-widest">Acesso Protegido</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
