import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventory, Product]),
        CacheModule,
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule { }
