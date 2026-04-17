import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { StudioGallery } from "@/components/landing/StudioGallery";
import { Testimonials } from "@/components/landing/Testimonials";
import { ParallaxWrapper } from "@/components/landing/ParallaxWrapper";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 relative">
        <Hero />

        {/* Featured Products Wrapper for Dynamic Data */}
        <ParallaxWrapper imageSrc="/images/theme/footer-bg.png">
          <FeaturedProducts />
          <StudioGallery />
        </ParallaxWrapper>

        <Testimonials />

        {/* Call to Action Section */}
        <section className="bg-linear-to-b from-zinc-950 to-black py-24 px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-black text-white md:text-6xl mb-8">
              Pronto para sua <br />
              <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">nova tatuagem?</span>
            </h2>
            <p className="text-zinc-400 mb-12 text-lg">
              Clique no botão abaixo e fale com nossa equipe via WhatsApp para agendar seu horário no estúdio mais premium de Fortaleza.
            </p>
            <a
              rel="noopener"
              href="https://wa.me/5585981025033?text=Ol%C3%A1%2C%20estou%20querendo%20fazer%20um%20agendamento%20com%20voc%C3%AAs%20e%20conhecer%20mais%20sobre%20o%20est%C3%BAdio!"
              target="_blank"
              className="inline-flex h-16 items-center justify-center rounded-2xl bg-white px-12 text-lg font-black uppercase text-black transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}