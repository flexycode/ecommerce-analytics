import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { Prediction } from './entities/prediction.entity';
import { SalesModule } from '../sales/sales.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CacheModule } from '../cache/cache.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Prediction]),
        SalesModule,
        InventoryModule,
        CacheModule,
    ],
    controllers: [PredictionsController],
    providers: [PredictionsService],
    exports: [PredictionsService],
})
export class PredictionsModule { }
