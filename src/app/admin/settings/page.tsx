import React from 'react';
import { Shield, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Configurações Globais</h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1">Parametrização operacional e comportamento da loja</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-6 items-start shadow-xl">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
            <Server className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="flex-1">
             <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Arquitetura Integrada (WhatsApp Flux)</h3>
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
               O ShopTattoo opera via arquitetura &rdquo;Headless WhatsApp&rdquo;. O gateway de roteamento numérico foi 
               inserido de maneira segura e direta (`NEXT_PUBLIC_WHATSAPP_NUMBER`) nos túneis da Vercel/Render. 
               Isso blinda a loja contra injeções de ataque tentando redirecionar seu fluxo de checkout para canais 
               concorrentes.
             </p>
             <div className="flex gap-3">
              <button
                type='button'
                title='Variaveis'
                disabled className="text-xs font-bold px-4 py-2.5 bg-black/50 border border-white/5 text-zinc-500 rounded-xl cursor-not-allowed">
                 Ambiente Variáveis (.env)
               </button>
             </div>
          </div>
        </div>

        <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-6 items-start shadow-xl">
          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 shrink-0">
            <Shield className="h-8 w-8 text-violet-400" />
          </div>
          <div className="flex-1">
             <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Gerenciamento de Acesso (Chave Mestra)</h3>
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
               Este aplicativo usa um design Zero-Trust Authentication. A senha da raiz administrativa não fica 
               armazenada vulnerávelmente em um banco de Relacionamentos, mas trancada no núcleo do Cloud Provider (`ADMIN_PASSWORD`). Mude-a no Dashboard da Servidora para rotacionar as credenciais.
             </p>
             <div className="flex gap-3">
              <button
                type='button'
                title='Senha'
                disabled className="text-xs font-bold px-4 py-2.5 bg-black/50 border border-white/5 text-zinc-500 rounded-xl cursor-not-allowed opacity-50">
                 Read Only (Bloqueado de Edição Client-Side)
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
