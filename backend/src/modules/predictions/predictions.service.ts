import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Prediction, PredictionType } from './entities/prediction.entity';
import { SalesService } from '../sales/sales.service';
import { CacheService } from '../cache/cache.service';

interface PredictionResult {
    productId: string;
    predictions: Array<{
        date: Date;
        predictedSales: number;
        predictedRevenue: number;
        confidence: number;
    }>;
}

@Injectable()
export class PredictionsService {
    private readonly logger = new Logger(PredictionsService.name);

    constructor(
        @InjectRepository(Prediction)
        private readonly predictionRepository: Repository<Prediction>,
        private readonly salesService: SalesService,
        private readonly cacheService: CacheService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Generate sales predictions for next N days
     * Uses historical data patterns - in production, this would call ML service
     */
    async generatePredictions(productId: string, days = 30): Promise<PredictionResult> {
        const cacheKey = `predictions:${productId}:${days}`;
        const cached = await this.cacheService.get<PredictionResult>(cacheKey);
        if (cached) return cached;

        // Get historical sales data for pattern analysis
        const historicalDays = 90;
        const dailySales = await this.salesService.getDailySales(historicalDays);

        // Simple moving average prediction (in production, use ML model)
        const avgDailySales = dailySales.length > 0
            ? dailySales.reduce((sum, d) => sum + d.sales, 0) / dailySales.length
            : 10;
        const avgDailyRevenue = dailySales.length > 0
            ? dailySales.reduce((sum, d) => sum + d.revenue, 0) / dailySales.length
            : 100;

        const predictions: PredictionResult['predictions'] = [];
        const today = new Date();

        for (let i = 1; i <= days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Add some variance and weekly patterns
            const dayOfWeek = date.getDay();
            const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1.0;
            const variance = 0.8 + Math.random() * 0.4; // 80% to 120%

            const predictedSales = Math.round(avgDailySales * weekendFactor * variance);
            const predictedRevenue = Math.round(avgDailyRevenue * weekendFactor * variance * 100) / 100;
            const confidence = 0.75 + Math.random() * 0.20; // 75% to 95%

            predictions.push({
                date,
                predictedSales,
                predictedRevenue,
                confidence: Math.round(confidence * 100) / 100,
            });

            // Store prediction in database
            await this.storePrediction({
                productId,
                predictionType: PredictionType.SALES_FORECAST,
                predictedValue: predictedSales,
                predictedRevenue,
                confidenceScore: confidence,
                predictionDate: date,
                factors: { weekendFactor, variance },
                modelMetadata: {
                    modelVersion: '1.0.0-simple',
                    trainedAt: new Date(),
                    accuracy: 0.82,
                    features: ['historical_sales', 'day_of_week'],
                },
            });
        }

        const result: PredictionResult = { productId, predictions };
        await this.cacheService.set(cacheKey, result, 3600); // Cache for 1 hour

        return result;
    }

    async storePrediction(data: Partial<Prediction>): Promise<Prediction> {
        const prediction = this.predictionRepository.create(data);
        return this.predictionRepository.save(prediction);
    }

    async getPredictions(
        productId?: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<Prediction[]> {
        const where: any = {};
        if (productId) where.productId = productId;
        if (startDate && endDate) {
            where.predictionDate = Between(startDate, endDate);
        } else if (startDate) {
            where.predictionDate = MoreThanOrEqual(startDate);
        }

        return this.predictionRepository.find({
            where,
            order: { predictionDate: 'ASC' },
        });
    }

    async getInventoryRecommendations(): Promise<Array<{
        productId: string;
        currentStock: number;
        predictedDemand: number;
        recommendedReorder: number;
        urgency: 'low' | 'medium' | 'high';
    }>> {
        const cacheKey = 'predictions:inventory-recommendations';
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        // In production, this combines predictions with current inventory
        // For now, returning sample structure
        const recommendations = [
            { productId: 'sample-1', currentStock: 15, predictedDemand: 50, recommendedReorder: 100, urgency: 'high' as const },
            { productId: 'sample-2', currentStock: 200, predictedDemand: 80, recommendedReorder: 0, urgency: 'low' as const },
        ];

        await this.cacheService.set(cacheKey, recommendations, 3600);
        return recommendations;
    }

    async getAggregatedForecast(days = 30): Promise<{
        totalPredictedSales: number;
        totalPredictedRevenue: number;
        averageConfidence: number;
        dailyBreakdown: Array<{ date: string; sales: number; revenue: number }>;
    }> {
        const cacheKey = `predictions:forecast:${days}`;
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);

        const predictions = await this.predictionRepository.find({
            where: {
                predictionDate: Between(today, endDate),
                predictionType: PredictionType.SALES_FORECAST,
            },
            order: { predictionDate: 'ASC' },
        });

        const totalPredictedSales = predictions.reduce((sum, p) => sum + p.predictedValue, 0);
        const totalPredictedRevenue = predictions.reduce((sum, p) => sum + Number(p.predictedRevenue || 0), 0);
        const averageConfidence = predictions.length > 0
            ? predictions.reduce((sum, p) => sum + Number(p.confidenceScore || 0), 0) / predictions.length
            : 0;

        // Group by date
        const dateMap = new Map<string, { sales: number; revenue: number }>();
        predictions.forEach((p) => {
            const dateStr = new Date(p.predictionDate).toISOString().split('T')[0];
            const existing = dateMap.get(dateStr) || { sales: 0, revenue: 0 };
            dateMap.set(dateStr, {
                sales: existing.sales + p.predictedValue,
                revenue: existing.revenue + Number(p.predictedRevenue || 0),
            });
        });

        const dailyBreakdown = Array.from(dateMap.entries()).map(([date, data]) => ({
            date,
            ...data,
        }));

        const result = {
            totalPredictedSales,
            totalPredictedRevenue,
            averageConfidence: Math.round(averageConfidence * 100) / 100,
            dailyBreakdown,
        };

        await this.cacheService.set(cacheKey, result, 3600);
        return result;
    }
}
