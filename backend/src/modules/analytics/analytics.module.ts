import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsGateway } from './analytics.gateway';
import { SalesModule } from '../sales/sales.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CacheModule } from '../cache/cache.module';

@Module({
    imports: [SalesModule, InventoryModule, CacheModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService, AnalyticsGateway],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
