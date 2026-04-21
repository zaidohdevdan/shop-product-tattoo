import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

// SVG icons para redes sociais (não disponíveis no lucide-react v1)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth={0}/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M4 4l16 16M4 20 20 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 pt-24 pb-8 px-6 overflow-hidden">
      {/* Hardcore Tattoo Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Image
          src="/images/theme/footer-bg.png"
          alt="Dark Tattoo Texture"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Camada de Gradiente 1: Suaviza o topo para mesclar com a página e escurece o rodapé levemente */}
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                title="ShopTattoo"
                alt='ShopTattoo Logo'
                src="/logo.png"
                width={40}
                height={40}
                className="rounded-xl shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)] hover:scale-105 transition-transform"
              />
              <span className="text-xl font-black uppercase tracking-tighter text-white">
                Shop<span className="text-indigo-500">Tattoo</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              O seu destino premium para suprimentos de tatuagem de alta qualidade e o melhor estúdio da região.
            </p>
            <div className="flex items-center gap-4">
              <a title="Instagram" href="#" className="text-white/50 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a title="Facebook" href="#" className="text-white/50 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a title="X / Twitter" href="#" className="text-white/50 hover:text-white transition-colors">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Navegação</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Produtos</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">O Estúdio / Quem Somos</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Dúvidas Frequentes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li><Link href="/terms#trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Como Comprar</Link></li>
              <li><Link href="/terms#privacidade" className="hover:text-white transition-colors">Políticas de Privacidade</Link></li>
              <li><Link href="/terms#termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contato</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Rua das Tatuagens, 123 - Centro, Fortaleza - CE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>(85) 99999-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>contato@shoptattoo.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 rounded-3xl border border-white/5 bg-zinc-950/50 p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Receba Ofertas Exclusivas</h3>
              <p className="mt-2 text-sm text-zinc-400">Inscreva-se para receber novidades, lançamentos e cupons de desconto.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-xs text-zinc-500 text-center md:text-left">
              © 2026 ShopTattoo. Todos os direitos reservados.
            </p>
            {/* Payment Methods */}
            <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <div className="h-6 w-9 rounded-sm bg-white/10 flex items-center justify-center p-1 border border-white/10">
                 <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={36} height={24} className="h-full w-auto" />
               </div>
               <div className="h-6 w-9 rounded-sm bg-white/10 flex items-center justify-center p-1 border border-white/10">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={36} height={24} className="h-full w-auto" />
               </div>
               <div className="h-6 w-9 rounded-sm bg-white/10 flex items-center justify-center p-1 border border-white/10">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Pix_logo.svg" alt="Pix" width={36} height={24} className="h-full w-auto" />
               </div>
               <div className="h-6 w-9 rounded-sm bg-white/10 flex items-center justify-center p-1 border border-white/10">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Elo_card_association_logo_-_black_text.svg" alt="Elo" width={36} height={24} className="h-full w-auto" />
               </div>
               <div className="h-6 w-9 rounded-sm bg-white/10 flex items-center justify-center p-1 border border-white/10">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={36} height={24} className="h-full w-auto" />
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-center gap-1">
              Desenvolvido com <span className="text-indigo-500">♥</span> por Daniel de Almeida
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ambiente Seguro & Criptografado
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
