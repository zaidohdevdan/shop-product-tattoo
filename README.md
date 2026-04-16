# Shop Product Tattoo

O maior e mais bem equipado estúdio e supply de tatuagem de Fortaleza. Tradição, precisão estética e produtos aprovados por profissionais.

## 🛠️ Tecnologias

- **Framework:** Next.js 16 (React 19)
- **Estilização:** Tailwind CSS 4
- **Banco de Dados:** PostgreSQL + Prisma
- **Estado:** Zustand
- **Animações:** Framer Motion
- **Autenticação:** Custom JWT (jose)

## 🎨 Design System: Flash UI Mission Control

Este projeto utiliza o sistema de design **Mission Control**, focado em:

- **Contraste Elevado:** Fundo deep navy (#020617) com textos em tons claros de slate e indigo.
- **Glassmorphism:** Uso refinado de desfoque de fundo e bordas semitransparentes (border-white/5).
- **Legibilidade:** Tipografia moderna (Inter para leitura e Bebas Neue para títulos de impacto).
- **Consistência:** Componentes padronizados para formulários, botões e cartões de produto.

## 🚀 Como Executar

### Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
npm run start
```

### Qualidade e Linting

```bash
npm run lint
```

### Testes Unitários

Instalamos o Jest + React Testing Library para garantir a integridade dos componentes críticos.

```bash
# Rodar todos os testes
npm run test

# Rodar testes em modo watch
npm run test:watch
```

## 🌐 Internacionalização (i18n)

A estrutura para suporte a múltiplos idiomas já está configurada utilizando `next-intl`.

- Arquivos de tradução em: `/messages/*.json`
- Configuração base em: `src/i18n.ts`

## 🛒 Estado do Carrinho

O carrinho é persistido localmente via `localStorage` com o middleware `persist` do Zustand, garantindo que os itens não sejam perdidos ao recarregar a página, com verificações de segurança para ambientes SSR.

## 📈 SEO e Performance

- **Otimização de Imagens:** Utiliza o componente `next/image` nativo com otimização automática.
- **Metadados Avançados:** Configuração completa de OpenGraph, Twitter Cards e tags canônicas dinâmicas.
- **JSON-LD:** Dados estruturados para produtos (Schema.org) implementados para melhor visibilidade em motores de busca.
