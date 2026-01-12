import { Injectable } from '@nestjs/common';
import { SalesService, SalesMetrics } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
import { CacheService } from '../cache/cache.service';

export interface DashboardMetrics {
    sales: SalesMetrics;
    inventory: {
        totalProducts: number;
        lowStockCount: number;
        outOfStockCount: number;
        totalValue: number;
    };
    realTimeStats: {
        todaySales: number;
        todayRevenue: number;
        currentVisitors: number;
        conversionRate: number;
    };
}

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly salesService: SalesService,
        private readonly inventoryService: InventoryService,
        private readonly cacheService: CacheService,
    ) { }

    async getDashboardMetrics(): Promise<DashboardMetrics> {
        const cacheKey = 'analytics:dashboard';
        const cached = await this.cacheService.get<DashboardMetrics>(cacheKey);
        if (cached) return cached;

        // Get date range for current period (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Get today's date range
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Fetch all metrics in parallel
        const [salesMetrics, inventorySummary, todayMetrics] = await Promise.all([
            this.salesService.getMetrics(startDate, endDate),
            this.inventoryService.getInventorySummary(),
            this.salesService.getMetrics(todayStart, todayEnd),
        ]);

        // Simulate real-time stats (in production, these would come from actual tracking)
        const realTimeStats = {
            todaySales: todayMetrics.totalSales,
            todayRevenue: todayMetrics.totalRevenue,
            currentVisitors: Math.floor(Math.random() * 500) + 100, // Placeholder
            conversionRate: todayMetrics.totalSales > 0 ? 3.2 : 0, // Placeholder
        };

        const metrics: DashboardMetrics = {
            sales: salesMetrics,
            inventory: inventorySummary,
            realTimeStats,
        };

        // Cache for 30 seconds for real-time feel
        await this.cacheService.set(cacheKey, metrics, 30);

        return metrics;
    }

    async getConversionFunnel(): Promise<{
        visitors: number;
        productViews: number;
        addToCart: number;
        checkout: number;
        purchases: number;
        conversionRate: number;
    }> {
        // In production, this would aggregate from actual analytics events
        // For now, returning sample data structure
        const cacheKey = 'analytics:funnel';
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const funnel = {
            visitors: 10000,
            productViews: 6500,
            addToCart: 2000,
            checkout: 800,
            purchases: 500,
            conversionRate: 5.0,
        };

        await this.cacheService.set(cacheKey, funnel, 300);
        return funnel;
    }

    async getRevenueByChannel(): Promise<Array<{ channel: string; revenue: number; percentage: number }>> {
        const cacheKey = 'analytics:revenue-by-channel';
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        // In production, aggregate from sales data
        const data = [
            { channel: 'Web', revenue: 125000, percentage: 45 },
            { channel: 'Mobile App', revenue: 97000, percentage: 35 },
            { channel: 'POS', revenue: 55500, percentage: 20 },
        ];

        await this.cacheService.set(cacheKey, data, 300);
        return data;
    }
}
