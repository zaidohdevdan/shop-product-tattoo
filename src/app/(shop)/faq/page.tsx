"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ChevronDown, MessageSquare, Truck, CreditCard, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqSections = [
  {
    title: "Pedidos & WhatsApp",
    icon: MessageSquare,
    questions: [
      {
        q: "Como realizo a compra de um equipamento?",
        a: "É simples! Navegue pelo nosso catálogo, adicione os itens ao carrinho e clique em 'Finalizar'. Você será redirecionado para o nosso WhatsApp oficial com a lista do seu pedido pronta. Lá, um consultor fechará os detalhes de pagamento e envio com você."
      },
      {
        q: "Por que o pagamento é feito pelo WhatsApp?",
        a: "Trabalhamos com equipamentos profissionais de alto valor e alta rotatividade. O fechamento humano garante que você receba exatamente o que precisa, tire dúvidas técnicas de última hora e combine a melhor forma de entrega personalizada."
      }
    ]
  },
  {
    title: "Entrega & Envios",
    icon: Truck,
    questions: [
      {
        q: "Qual o prazo de entrega para Fortaleza?",
        a: "Para entregas em Fortaleza, o prazo padrão é de 24h a 48h úteis após a confirmação do pagamento. Também oferecemos retirada imediata no estúdio."
      },
      {
        q: "Vocês enviam para outros estados?",
        a: "Sim! Enviamos suprimentos para todo o Brasil via Correios (PAC/SEDEX) ou transportadoras. O custo e prazo variam de acordo com a sua região."
      }
    ]
  },
  {
    title: "Pagamentos & Segurança",
    icon: CreditCard,
    questions: [
      {
        q: "Quais as formas de pagamento aceitas?",
        a: "Aceitamos PIX (com desconto progressivo), Cartões de Crédito (em até 12x), Débito e Boleto Bancário via MercadoPago/Asaas."
      },
      {
        q: "Os produtos são originais e têm garantia?",
        a: "Absolutamente. Todos os nossos produtos são adquiridos diretamente dos fabricantes ou distribuidores oficiais. Oferecemos garantia mínima de 90 dias para defeitos de fabricação em máquinas e fontes."
      }
    ]
  },
  {
    title: "Estúdio & Tatuagem",
    icon: UserCheck,
    questions: [
      {
        q: "Como faço para agendar uma tatuagem?",
        a: "Os agendamentos são feitos exclusivamente via WhatsApp. Você pode clicar no botão 'Agendar Tatuagem' na nossa home ou entrar em contato pelo link flutuante. Envie sua ideia, tamanho aproximado e local do corpo para um orçamento."
      },
      {
        q: "O estúdio segue as normas da Anvisa?",
        a: "Sim, somos certificados e seguimos rigorosamente todos os protocolos de biossegurança exigidos pela Anvisa. Utilizamos apenas materiais descartáveis e pigmentos liberados."
      }
    ]
  }
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className="text-sm md:text-base font-bold text-white pr-8">{q}</span>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-zinc-500 transition-transform duration-300 shrink-0",
            isOpen && "rotate-180 text-indigo-500"
          )} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-sm md:text-base text-zinc-400 leading-relaxed max-w-3xl">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-20 text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Central de Ajuda</span>
            <h1 className="mt-4 text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Dúvidas <span className="text-zinc-600">Frequentes</span>
            </h1>
            <p className="mt-6 text-zinc-500 text-sm md:text-base max-w-lg mx-auto">
              Tudo o que você precisa saber sobre compras, envios e agendamentos no maior hub de tatuagem de Fortaleza.
            </p>
          </div>

          <div className="space-y-16">
            {faqSections.map((section, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex items-center gap-3 mb-6 border-l-2 border-indigo-500 pl-4">
                  <section.icon className="h-4 w-4 text-indigo-500" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-white">{section.title}</h2>
                </div>
                <div className="bg-zinc-950/50 rounded-3xl border border-white/5 px-8">
                  {section.questions.map((item, qIdx) => (
                    <FAQItem key={qIdx} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="mt-24 rounded-3xl bg-linear-to-b from-indigo-900/20 to-black p-12 text-center border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Ainda tem dúvidas?</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm">
              Nossa equipe está pronta para te atender e tirar qualquer dúvida técnica sobre equipamentos ou agendamentos.
            </p>
            <a
              href="https://wa.me/5585981025033"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-8 text-xs font-black uppercase tracking-widest text-black hover:scale-105 active:scale-95 transition-all"
            >
              Falar com Consultor no WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
