import React from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Shield, ArrowRight, Gavel, RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Termos e Políticas — Shop Tattoo",
  description: "Informações legais sobre privacidade, trocas, devoluções e termos de uso da ShopTattoo.",
};

const sections = [
  {
    id: "privacidade",
    title: "Política de Privacidade",
    icon: Shield,
    content: `
      Nós na ShopTattoo respeitamos a sua privacidade. Esta política descreve como coletamos e usamos seus dados:
      - **Coleta de Dados:** Coletamos apenas informações necessárias para o processamento de pedidos (Nome, Email, WhatsApp e Endereço).
      - **Uso de Dados:** Seus dados são usados exclusivamente para garantir a entrega dos produtos e comunicações sobre seu pedido.
      - **Segurança:** Utilizamos criptografia de ponta a ponta em nosso servidor e não armazenamos dados de pagamento (estes são processados diretamente pelos gateways parceiros).
      - **Compartilhamento:** Nunca vendemos seus dados para terceiros.
    `
  },
  {
    id: "trocas",
    title: "Trocas e Devoluções",
    icon: RefreshCcw,
    content: `
      Nossa política de trocas atende ao Código de Defesa do Consumidor, com atenção especial à natureza dos nossos produtos:
      - **Arrependimento:** Você tem até 7 dias corridos após o recebimento para desistir da compra, desde que a embalagem original não tenha sido violada (especialmente para tintas, agulhas e descartáveis).
      - **Defeitos de Fabricação:** Máquinas e fontes possuem garantia de 90 dias contra defeitos de fabricação.
      - **Itens de Higiene:** Por normas sanitárias, não aceitamos trocas de agulhas, biqueiras ou tintas que tenham sido abertas ou cujos lacres originais tenham sido rompidos.
      - **Processo:** Para iniciar uma troca, entre em contato via WhatsApp com o número do seu pedido e fotos do produto.
    `
  },
  {
    id: "termos",
    title: "Termos de Uso",
    icon: Gavel,
    content: `
      Ao acessar o site ShopTattoo, você concorda com os seguintes termos:
      - **Uso Profissional:** Alguns equipamentos vendidos em nosso catálogo são destinados exclusivamente ao uso por profissionais da área de tatuagem e body piercing.
      - **Preços e Estoques:** Reservamo-nos o direito de corrigir erros de preços ou esgotamento de estoque sem aviso prévio, dado o fluxo dinâmico de vendas via WhatsApp.
      - **Propriedade Intelectual:** Todo o conteúdo deste site (fotos, textos e logotipos) é de propriedade exclusiva da ShopTattoo.
    `
  }
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Termos e <span className="text-zinc-600">Políticas</span>
            </h1>
            <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Transparência e segurança em cada pedido.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block space-y-2 sticky top-32 h-fit">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between group rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
                >
                  {section.title}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </aside>

            {/* Content Area */}
            <div className="space-y-24">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{section.title}</h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-strong:text-white prose-p:leading-relaxed prose-li:text-zinc-400">
                    <div className="whitespace-pre-line text-lg text-zinc-400 leading-relaxed font-medium">
                      {section.content.trim().split("\n").map((line, i) => {
                        const isBullet = line.trim().startsWith("- ");
                        if (isBullet) {
                          return (
                            <div key={i} className="flex gap-3 mb-2 pl-4">
                              <span className="text-indigo-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: line.trim().substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            </div>
                          );
                        }
                        return (
                          <p 
                            key={i} 
                            className="mb-4"
                            dangerouslySetInnerHTML={{ __html: line.trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} 
                          />
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
