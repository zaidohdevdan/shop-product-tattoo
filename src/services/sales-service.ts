import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export type TimeRange = "day" | "week" | "fortnight" | "month" | "quarter" | "semester" | "year";

export interface DashboardMetrics {
  current: {
    revenue: number;
    orders: number;
    avgTicket: number;
    profit: number;
    profitMargin: number;
  };
  previous: {
    revenue: number;
    orders: number;
    avgTicket: number;
    profit: number;
    profitMargin: number;
  };
  range: TimeRange;
}


const RANGE_DAYS: Record<TimeRange, number> = {
  day: 1,
  week: 7,
  fortnight: 15,
  month: 30,
  quarter: 90,
  semester: 180,
  year: 365,
};

export const salesService = {
  async getDashboardStats(range: TimeRange = "week"): Promise<DashboardMetrics> {
    const days = RANGE_DAYS[range];
    const now = new Date();

    // Current period range
    const currentEnd = now;
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - days);

    // Previous period range (of same length)
    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousEnd.getDate() - days);

    // Fetch orders for both periods
    const [currentOrders, previousOrders] = await Promise.all([
      this.getConfirmedOrders(currentStart, currentEnd),
      this.getConfirmedOrders(previousStart, previousEnd),
    ]);

    const calculateStats = (orders: Awaited<ReturnType<typeof this.getConfirmedOrders>>) => {
      let revenue = 0;
      let totalCost = 0;

      orders.forEach(order => {
        revenue += Number(order.totalPrice);

        // Calculate cost from items
        if (order.items) {
          order.items.forEach((item) => {
            const cost = Number(item.product?.costPrice || 0);
            totalCost += Number(item.quantity) * cost;
          });
        }
      });

      const ordersCount = orders.length;
      const avgTicket = ordersCount > 0 ? revenue / ordersCount : 0;
      const profit = revenue - totalCost;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return { revenue, orders: ordersCount, avgTicket, profit, profitMargin };
    };

    return {
      current: calculateStats(currentOrders),
      previous: calculateStats(previousOrders),
      range,
    };
  },

  async getConfirmedOrders(start: Date, end: Date) {
    return prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                costPrice: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getRecentOrders(limit = 5) {
    return prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
  },

  /**
   * Retorna dados formatados para o gráfico de tendências
   */
  async getSalesTrendData(range: TimeRange = "week") {
    const days = RANGE_DAYS[range];
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: { gte: start },
      },
      include: {
        items: {
          include: {
            product: { select: { costPrice: true } }
          }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    // Agrupar por dia
    const trendMap = new Map<string, { date: string; revenue: number; profit: number }>();

    // Inicializar o mapa com todos os dias do período (para evitar buracos no gráfico)
    for (let i = 0; i <= days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      trendMap.set(dateStr, { date: dateStr, revenue: 0, profit: 0 });
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const current = trendMap.get(dateStr) || { date: dateStr, revenue: 0, profit: 0 };

      const revenue = Number(order.totalPrice);
      let cost = 0;
      order.items.forEach(item => {
        cost += Number(item.quantity) * Number(item.product.costPrice || 0);
      });

      trendMap.set(dateStr, {
        date: dateStr,
        revenue: current.revenue + revenue,
        profit: current.profit + (revenue - cost),
      });
    });

    return Array.from(trendMap.values());
  },

  /**
   * Retorna a distribuição de vendas por categoria (BI Mix)
   */
  async getSalesByCategory(range: TimeRange = "week") {
    const days = RANGE_DAYS[range];
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: { gte: start },
      },
      include: {
        items: {
          include: {
            product: { 
              select: { 
                category: { select: { name: true } } 
              } 
            }
          }
        }
      },
    });

    const categoryMap = new Map<string, number>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const catName = item.product?.category?.name || "Outros";
        const revenue = Number(item.price) * Number(item.quantity);
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + revenue);
      });
    });

    // Converter para formato Recharts
    // Array ordenado por valor decrescente
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }
};
