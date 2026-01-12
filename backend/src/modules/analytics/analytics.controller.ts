import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get comprehensive dashboard metrics' })
    @ApiResponse({ status: 200, description: 'Dashboard metrics retrieved successfully' })
    async getDashboardMetrics() {
        return this.analyticsService.getDashboardMetrics();
    }

    @Get('funnel')
    @ApiOperation({ summary: 'Get conversion funnel data' })
    @ApiResponse({ status: 200, description: 'Funnel data retrieved successfully' })
    async getConversionFunnel() {
        return this.analyticsService.getConversionFunnel();
    }

    @Get('revenue-by-channel')
    @ApiOperation({ summary: 'Get revenue breakdown by sales channel' })
    @ApiResponse({ status: 200, description: 'Revenue by channel retrieved successfully' })
    async getRevenueByChannel() {
        return this.analyticsService.getRevenueByChannel();
    }
}
