import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CacheService } from '../cache/cache.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';

export interface SalesMetrics {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesGrowth: number;
    topProducts: Array<{ productId: string; productName: string; quantity: number; revenue: number }>;
}

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        private readonly cacheService: CacheService,
        private readonly inventoryService: InventoryService,
    ) { }

    async create(createSaleDto: CreateSaleDto): Promise<Sale> {
        const sale = this.saleRepository.create({
            ...createSaleDto,
            totalAmount: createSaleDto.quantity * createSaleDto.unitPrice,
            saleDate: new Date(),
        });

        const savedSale = await this.saleRepository.save(sale);

        // Update inventory
        await this.inventoryService.decreaseStock(createSaleDto.productId, createSaleDto.quantity);

        // Invalidate cache
        await this.cacheService.deletePattern('sales:metrics:*');

        // Publish real-time event
        await this.cacheService.publish('sales:new', savedSale);

        return savedSale;
    }

    async findAll(page = 1, limit = 20): Promise<{ data: Sale[]; total: number }> {
        const [data, total] = await this.saleRepository.findAndCount({
            order: { saleDate: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }

    async findOne(id: string): Promise<Sale | null> {
        return this.saleRepository.findOne({ where: { id } });
    }

    async getMetrics(startDate: Date, endDate: Date): Promise<SalesMetrics> {
        const cacheKey = `sales:metrics:${startDate.toISOString()}:${endDate.toISOString()}`;

        const cached = await this.cacheService.get<SalesMetrics>(cacheKey);
        if (cached) return cached;

        const sales = await this.saleRepository.find({
            where: {
                saleDate: Between(startDate, endDate),
            },
            relations: ['product'],
        });

        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        // Calculate top products
        const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
        sales.forEach((sale) => {
            const existing = productMap.get(sale.productId) || { name: sale.product?.name || '', quantity: 0, revenue: 0 };
            productMap.set(sale.productId, {
                name: existing.name,
                quantity: existing.quantity + sale.quantity,
                revenue: existing.revenue + Number(sale.totalAmount),
            });
        });

        const topProducts = Array.from(productMap.entries())
            .map(([productId, data]) => ({ productId, productName: data.name, quantity: data.quantity, revenue: data.revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Calculate growth (compare to previous period)
        const periodLength = endDate.getTime() - startDate.getTime();
        const previousStartDate = new Date(startDate.getTime() - periodLength);
        const previousSales = await this.saleRepository.find({
            where: {
                saleDate: Between(previousStartDate, startDate),
            },
        });
        const previousRevenue = previousSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
        const salesGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        const metrics: SalesMetrics = {
            totalSales,
            totalRevenue,
            averageOrderValue,
            salesGrowth,
            topProducts,
        };

        await this.cacheService.set(cacheKey, metrics, 60); // Cache for 60 seconds

        return metrics;
    }

    async getDailySales(days = 30): Promise<Array<{ date: string; sales: number; revenue: number }>> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const sales = await this.saleRepository
            .createQueryBuilder('sale')
            .select("DATE(sale.saleDate)", 'date')
            .addSelect('COUNT(*)', 'sales')
            .addSelect('SUM(sale.totalAmount)', 'revenue')
            .where('sale.saleDate >= :startDate', { startDate })
            .andWhere('sale.saleDate <= :endDate', { endDate })
            .groupBy("DATE(sale.saleDate)")
            .orderBy('date', 'ASC')
            .getRawMany();

        return sales.map((row) => ({
            date: row.date,
            sales: parseInt(row.sales, 10),
            revenue: parseFloat(row.revenue),
        }));
    }
}
