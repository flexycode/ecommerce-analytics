import { Controller, Get, Post, Query, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('predictions')
@Controller('api/predictions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PredictionsController {
    constructor(private readonly predictionsService: PredictionsService) { }

    @Post('generate/:productId')
    @ApiOperation({ summary: 'Generate sales predictions for a product' })
    @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to predict' })
    async generatePredictions(
        @Param('productId', ParseUUIDPipe) productId: string,
        @Query('days') days = 30,
    ) {
        return this.predictionsService.generatePredictions(productId, +days);
    }

    @Get()
    @ApiOperation({ summary: 'Get stored predictions' })
    @ApiQuery({ name: 'productId', required: false, type: String })
    @ApiQuery({ name: 'startDate', required: false, type: String })
    @ApiQuery({ name: 'endDate', required: false, type: String })
    async getPredictions(
        @Query('productId') productId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.predictionsService.getPredictions(
            productId,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
        );
    }

    @Get('forecast')
    @ApiOperation({ summary: 'Get aggregated sales forecast' })
    @ApiQuery({ name: 'days', required: false, type: Number })
    async getForecast(@Query('days') days = 30) {
        return this.predictionsService.getAggregatedForecast(+days);
    }

    @Get('inventory-recommendations')
    @ApiOperation({ summary: 'Get AI-powered inventory reorder recommendations' })
    async getInventoryRecommendations() {
        return this.predictionsService.getInventoryRecommendations();
    }
}
