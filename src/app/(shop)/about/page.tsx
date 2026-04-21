import React from "react";
import Image from "next/image";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ShieldCheck, Music, Coffee, Trophy, Users, Zap } from "lucide-react";
import { StudioGallery } from "@/components/landing/StudioGallery";

export const metadata = {
  title: "Quem Somos — Shop Tattoo",
  description: "Conheça a história do maior estúdio e supply de tatuagem de Fortaleza. Tradição, arte e profissionalismo em cada detalhe.",
};

const stats = [
  { label: "Tatuagens Realizadas", value: "5.000+", icon: Zap },
  { label: "Anos de Experiência", value: "10+", icon: Trophy },
  { label: "Produtos no Catálogo", value: "450+", icon: ShieldCheck },
  { label: "Profissionais Parceiros", value: "100+", icon: Users },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1">
        {/* About Hero */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-24">
          <Image
            src="/images/landing/studio-interior-2.png"
            alt="Fundo do Estúdio"
            fill
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black" />
          
          <div className="relative z-10 text-center px-6">
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">
              Nossa <span className="bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Essência</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs md:text-sm">
              Mais que um estúdio, um hub de arte e tecnologia
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-indigo-500 font-black uppercase tracking-widest text-[11px]">Uma Década de Tradição</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Forjados no <br />
                <span className="text-zinc-600">asfalto de Fortaleza.</span>
              </h2>
              <div className="space-y-6 text-lg text-zinc-400">
                <p>
                  O ShopTattoo nasceu da paixão pela arte milenar da tatuagem e da necessidade de trazer para o Ceará o que há de mais moderno em equipamentos mundiais. 
                </p>
                <p>
                  Começamos como um pequeno estúdio focado em realismo e hoje somos referência não apenas em arte na pele, mas como o principal fornecedor de suprimentos para profissionais de todo o estado.
                </p>
                <p>
                  Nossa missão é simples: garantir que cada artista tenha acesso às melhores ferramentas e que cada cliente viva uma experiência segura, premium e inesquecível.
                </p>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/5 bg-zinc-950 p-2">
              <div className="absolute inset-0 z-10 bg-linear-to-tr from-indigo-500/10 to-transparent" />
              <Image 
                src="/images/theme/footer-bg.png" 
                alt="Arte e Tradição" 
                fill 
                className="object-cover opacity-60"
              />
              <div className="relative h-full w-full rounded-2xl border border-white/10 flex items-center justify-center p-12 overflow-hidden bg-black/40 backdrop-blur-sm">
                 <div className="space-y-12 w-full">
                    {stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                          <stat.icon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{stat.value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="bg-zinc-950 py-24 px-6 border-y border-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">O Que Nos Move</h2>
              <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Nossos pilares de excelência</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Qualidade Sem Compromisso", desc: "Trabalhamos apenas com marcas certificadas pela Anvisa e as melhores agulhas e pigmentos do mercado global.", icon: ShieldCheck },
                { title: "Ambiente Premium", desc: "Bio-segurança total em um lounge sofisticado projetado para o seu conforto durante longas sessões.", icon: Coffee },
                { title: "Cultura Urbana", desc: "Respiramos arte, música e comportamento. O ShopTattoo é um ponto de encontro da cultura underground de Fortaleza.", icon: Music },
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-3xl border border-white/5 bg-black/30 hover:border-indigo-500/30 transition-all duration-500 group">
                  <div className="mb-8 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reuse Studio Gallery for Context */}
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 mb-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nosso Espaço</h2>
          </div>
          <StudioGallery />
        </div>

      </main>

      <Footer />
    </div>
  );
}
