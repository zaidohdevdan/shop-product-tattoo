import { z } from "zod";

/**
 * Validação para parâmetros de busca no catálogo
 */
export const productFilterSchema = z.object({
  categoria: z.string().optional(),
  search: z.string().optional(),
});

/**
 * Validação para detalhes do produto (slug)
 */
export const productSlugSchema = z.string().min(1, "Slug é obrigatório");

/**
 * Schema completo do produto (útil para o Admin no futuro)
 */
export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  sku: z.string().min(3, "SKU é obrigatório"),
  images: z.array(z.string()).min(1, "Ao menos uma imagem é necessária"),
  stock: z.number().int().nonnegative("Estoque não pode ser negativo"),
  categoryId: z.string().uuid("Categoria inválida"),
});

export type ProductInput = z.infer<typeof productSchema>;
