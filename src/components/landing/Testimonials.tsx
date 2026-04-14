"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Ricardo Mendes",
    role: "Tatuador Profissional",
    content: "Os equipamentos da ShopTattoo mudaram meu nível de precisão. O atendimento via WhatsApp é rápido e eficiente.",
    avatar: "https://i.pravatar.cc/150?u=ricardo",
    rating: 5,
  },
  {
    id: 2,
    name: "Juliana Souza",
    role: "Cliente de Estúdio",
    content: "Fiz minha primeira tatuagem aqui e a experiência foi incrível. Ambiente limpo, artistas talentosos e super atenciosos.",
    avatar: "https://i.pravatar.cc/150?u=juliana",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcos Oliveira",
    role: "Proprietário de Estúdio",
    content: "Compro todas as minhas tintas e agulhas aqui. A qualidade é constante e o preço é o melhor do mercado.",
    avatar: "https://i.pravatar.cc/150?u=marcos",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-zinc-950 py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
            Social Proof
          </h2>
          <h3 className="mt-4 text-4xl font-black text-white md:text-5xl">
            O que dizem sobre nós
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm"
            >
              <Quote className="absolute right-8 top-8 h-10 w-10 text-white/5" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-zinc-400 leading-relaxed mb-8 italic">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
