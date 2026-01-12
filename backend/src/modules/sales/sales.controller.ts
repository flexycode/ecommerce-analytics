import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('sales')
@Controller('api/sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new sale' })
    @ApiResponse({ status: 201, description: 'Sale created successfully' })
    async create(@Body() createSaleDto: CreateSaleDto) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sales with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.salesService.findAll(+page, +limit);
    }

    @Get('metrics')
    @ApiOperation({ summary: 'Get sales metrics for a date range' })
    @ApiQuery({ name: 'startDate', required: true, type: String })
    @ApiQuery({ name: 'endDate', required: true, type: String })
    async getMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.salesService.getMetrics(new Date(startDate), new Date(endDate));
    }

    @Get('daily')
    @ApiOperation({ summary: 'Get daily sales summary' })
    @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to fetch' })
    async getDailySales(@Query('days') days = 30) {
        return this.salesService.getDailySales(+days);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a sale by ID' })
    @ApiResponse({ status: 200, description: 'Sale found' })
    @ApiResponse({ status: 404, description: 'Sale not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.salesService.findOne(id);
    }
}
