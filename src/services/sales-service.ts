import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export type TimeRange = "day" | "week" | "fortnight" | "month" | "quarter" | "semester" | "year";

export interface DashboardMetrics {
  current: {
    revenue: number;
    orders: number;
    avgTicket: number;
  };
  previous: {
    revenue: number;
    orders: number;
    avgTicket: number;
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

    const calculateStats = (orders: { totalPrice: number | string | { toString(): string } }[]) => {
      const revenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
      const ordersCount = orders.length;
      const avgTicket = ordersCount > 0 ? revenue / ordersCount : 0;
      return { revenue, orders: ordersCount, avgTicket };
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
  }
};
