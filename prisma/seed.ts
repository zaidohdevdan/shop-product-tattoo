import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed...");

  // Limpar banco
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ── Categorias ──────────────────────────────────────────────
  const [maquinas, tintas, agulhas, acessorios] = await Promise.all([
    prisma.category.create({ data: { name: "Máquinas", slug: "maquinas" } }),
    prisma.category.create({ data: { name: "Tintas", slug: "tintas" } }),
    prisma.category.create({ data: { name: "Agulhas", slug: "agulhas" } }),
    prisma.category.create({ data: { name: "Acessórios", slug: "acessorios" } }),
  ]);

  // ── Produtos ─────────────────────────────────────────────────
  const products = [
    // MÁQUINAS
    {
      name: "Máquina Pro Stealth V2",
      slug: "maquina-pro-stealth-v2",
      description:
        "Motor brushless de última geração com controle de curso de 2,5 a 4,5mm. Corpo em alumínio aeronáutico CNC anodizado. Vibração mínima para sombreamentos e traços finos de alta precisão. Inclui grip ergonômico e fonte de alimentação.",
      price: 1890.0,
      sku: "MAQ-001",
      images: [
        "/images/products/maquina-stealth-1.png",
        "/images/products/maquina-ghost-1.png",
      ],
      categoryId: maquinas.id,
      stock: 12,
    },
    {
      name: "Máquina Rotativa Ghost RCA",
      slug: "maquina-rotativa-ghost-rca",
      description:
        "Máquina rotativa leve (apenas 115g) com conexão RCA padrão. Ideal para linha e colorido. Corpo em liga de zinco com acabamento fosco. Compatível com todos os grips descartáveis do mercado.",
      price: 890.0,
      sku: "MAQ-002",
      images: [
        "/images/products/maquina-ghost-1.png",
        "/images/products/maquina-stealth-1.png",
      ],
      categoryId: maquinas.id,
      stock: 8,
    },
    // TINTAS
    {
      name: "Kit Tinta Preto Intenso 30ml",
      slug: "tinta-preto-intenso-30ml",
      description:
        "Pigmento puro formulado para traços sólidos e preenchimentos profundos. Alta concentração de partículas de carbono para resultado máximo em preto-e-branco. Aprovado e registrado na ANVISA.",
      price: 68.0,
      sku: "TIN-001",
      images: [
        "/images/products/tinta-preto-1.png",
      ],
      categoryId: tintas.id,
      stock: 80,
    },
    {
      name: "Set de Tintas Coloridas — 12 cores",
      slug: "set-tintas-coloridas-12",
      description:
        "Conjunto premium com 12 frascos de 15ml em cores vibrantes: vermelho, azul royal, verde floresta, amarelo, roxo, laranja, rosa, aqua, branco, cinza claro, cinza médio e sépia. Formulação orgânica vegana.",
      price: 420.0,
      sku: "TIN-002",
      images: [
        "/images/products/tinta-colorida-1.png",
        "/images/products/tinta-preto-1.png",
      ],
      categoryId: tintas.id,
      stock: 30,
    },
    // AGULHAS
    {
      name: "Agulhas Liner 3RL — Caixa c/ 50un",
      slug: "agulhas-liner-3rl-50un",
      description:
        "Agulhas retas de 3 pontas para linhas finas e detalhes delicados. Esterilizadas individualmente com ETO, embaladas a vácuo. Aço cirúrgico inoxidável grau AISI 316L. Compatíveis com todos os cartuchos padrão.",
      price: 89.9,
      sku: "AGU-001",
      images: [
        "/images/products/agulha-liner-1.png",
      ],
      categoryId: agulhas.id,
      stock: 150,
    },
    {
      name: "Cartuchos Magnum 15M1 — Caixa c/ 20un",
      slug: "cartuchos-magnum-15m1-20un",
      description:
        "Cartuchos com membrana anti-retorno integrada. Disposição magnum curvada para sombreados amplos com menos passagens. Sistema de encaixe universal. Descartáveis, uso único.",
      price: 145.0,
      sku: "AGU-002",
      images: [
        "/images/products/magnum-1.png",
      ],
      categoryId: agulhas.id,
      stock: 60,
    },
    // ACESSÓRIOS
    {
      name: "Fonte Digital Bivolt Pro 3A",
      slug: "fonte-digital-bivolt-pro-3a",
      description:
        "Fonte de alimentação digital com display LCD, voltagem regulável de 1V a 18V e corrente máxima de 3A. Modo memória para salvar configurações favoritas. Compatível com plug RCA e clipcord. Bivolt automático 110/220V.",
      price: 340.0,
      sku: "ACE-001",
      images: [
        "/images/products/fonte-1.png",
      ],
      categoryId: acessorios.id,
      stock: 20,
    },
    {
      name: "Kit Higiene Profissional — 100 itens",
      slug: "kit-higiene-profissional-100",
      description:
        "Kit completo para procedimentos seguros: 20 películas protetoras para máquina, 20 copos de tinta descartáveis, 30 pares de luvas de nitrilo (M), 20 lenços de papel médico e 10 cummins protetores de barra. Validade 2 anos.",
      price: 78.0,
      sku: "ACE-002",
      images: [
        "/images/products/kit-higiene-1.png",
      ],
      categoryId: acessorios.id,
      stock: 40,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Seed finalizado: ${products.length} produtos criados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

