import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly cacheService: CacheService,
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        const savedProduct = await this.productRepository.save(product);

        // Create initial inventory record
        const inventory = this.inventoryRepository.create({
            productId: savedProduct.id,
            currentStock: 0,
            reorderLevel: 10,
            reorderQuantity: 50,
        });
        await this.inventoryRepository.save(inventory);

        return savedProduct;
    }

    async findAllProducts(page = 1, limit = 20): Promise<{ data: Product[]; total: number }> {
        const [data, total] = await this.productRepository.findAndCount({
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['inventory'],
        });
        return { data, total };
    }

    async findProductById(id: string): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { id },
            relations: ['inventory'],
        });
    }

    async getInventory(productId: string): Promise<Inventory | null> {
        return this.inventoryRepository.findOne({ where: { productId } });
    }

    async updateInventory(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({ where: { productId } });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        Object.assign(inventory, updateInventoryDto);

        // Check low stock status
        inventory.isLowStock = inventory.currentStock <= inventory.reorderLevel;

        const updated = await this.inventoryRepository.save(inventory);

        // Publish real-time update
        await this.cacheService.publish('inventory:updated', updated);

        // Alert if low stock
        if (inventory.isLowStock) {
            await this.cacheService.publish('inventory:low-stock', {
                productId,
                currentStock: inventory.currentStock,
                reorderLevel: inventory.reorderLevel,
            });
        }

        return updated;
    }

    async decreaseStock(productId: string, quantity: number): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({ where: { productId } });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        if (inventory.availableStock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        inventory.currentStock -= quantity;
        inventory.isLowStock = inventory.currentStock <= inventory.reorderLevel;

        const updated = await this.inventoryRepository.save(inventory);

        // Publish events
        await this.cacheService.publish('inventory:stock-decreased', {
            productId,
            quantity,
            newStock: inventory.currentStock,
        });

        if (inventory.isLowStock) {
            await this.cacheService.publish('inventory:low-stock', {
                productId,
                currentStock: inventory.currentStock,
                reorderLevel: inventory.reorderLevel,
            });
        }

        return updated;
    }

    async increaseStock(productId: string, quantity: number): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({ where: { productId } });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        inventory.currentStock += quantity;
        inventory.isLowStock = inventory.currentStock <= inventory.reorderLevel;
        inventory.lastRestockDate = new Date();

        const updated = await this.inventoryRepository.save(inventory);

        await this.cacheService.publish('inventory:restocked', {
            productId,
            quantity,
            newStock: inventory.currentStock,
        });

        return updated;
    }

    async getLowStockItems(): Promise<Inventory[]> {
        return this.inventoryRepository.find({
            where: { isLowStock: true },
            relations: ['product'],
        });
    }

    async getInventorySummary(): Promise<{
        totalProducts: number;
        lowStockCount: number;
        outOfStockCount: number;
        totalValue: number;
    }> {
        const cacheKey = 'inventory:summary';
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const inventories = await this.inventoryRepository.find({ relations: ['product'] });

        const summary = {
            totalProducts: inventories.length,
            lowStockCount: inventories.filter((i) => i.isLowStock && i.currentStock > 0).length,
            outOfStockCount: inventories.filter((i) => i.currentStock === 0).length,
            totalValue: inventories.reduce(
                (sum, i) => sum + i.currentStock * Number(i.product?.price || 0),
                0,
            ),
        };

        await this.cacheService.set(cacheKey, summary, 60);

        return summary;
    }
}
