import { prisma } from "@/lib/prisma";
import { Prisma, SubscriptionStatus } from "@prisma/client";

export interface SubscriptionPlain {
  id: string;
  email: string;
  status: SubscriptionStatus;
  createdAt: Date;
}

export const newsletterService = {
  /**
   * Inscreve um e-mail na newsletter com tratamento de duplicidade.
   */
  async subscribe(email: string) {
    const existing = await prisma.subscription.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.status === SubscriptionStatus.ACTIVE) {
        throw new Error("Este e-mail já está inscrito em nossa lista.");
      }
      
      // Reativa se estivesse arquivado ou cancelado
      return prisma.subscription.update({
        where: { id: existing.id },
        data: { status: SubscriptionStatus.ACTIVE }
      });
    }

    return prisma.subscription.create({
      data: { email }
    });
  },

  /**
   * Busca inscrições com base no status e termo de busca.
   */
  async getSubscriptions(status?: SubscriptionStatus, search?: string): Promise<SubscriptionPlain[]> {
    const where: Prisma.SubscriptionWhereInput = status ? { status } : {};
    
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    return prisma.subscription.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Muda o status para ARCHIVED.
   */
  async archiveSubscription(id: string) {
    return prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.ARCHIVED }
    });
  },

  /**
   * Muda o status para ACTIVE (Desarquivar).
   */
  async unarchiveSubscription(id: string) {
    return prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.ACTIVE }
    });
  },

  /**
   * Deleta permanentemente.
   */
  async deleteSubscription(id: string) {
    return prisma.subscription.delete({
      where: { id }
    });
  },

  /**
   * Estatísticas simplificadas para o cockpit.
   */
  async getStats() {
    const [total, active, archived, today] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.ARCHIVED } }),
      prisma.subscription.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    return { total, active, archived, today };
  }
};
