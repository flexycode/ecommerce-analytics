import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('inventory')
@Controller('api/inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return this.inventoryService.createProduct(createProductDto);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get all products with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAllProducts(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.inventoryService.findAllProducts(+page, +limit);
    }

    @Get('products/:id')
    @ApiOperation({ summary: 'Get a product by ID' })
    async findProductById(@Param('id', ParseUUIDPipe) id: string) {
        return this.inventoryService.findProductById(id);
    }

    @Get(':productId')
    @ApiOperation({ summary: 'Get inventory for a product' })
    async getInventory(@Param('productId', ParseUUIDPipe) productId: string) {
        return this.inventoryService.getInventory(productId);
    }

    @Put(':productId')
    @ApiOperation({ summary: 'Update inventory for a product' })
    async updateInventory(
        @Param('productId', ParseUUIDPipe) productId: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ) {
        return this.inventoryService.updateInventory(productId, updateInventoryDto);
    }

    @Post(':productId/restock')
    @ApiOperation({ summary: 'Restock a product' })
    async restockProduct(
        @Param('productId', ParseUUIDPipe) productId: string,
        @Body('quantity') quantity: number,
    ) {
        return this.inventoryService.increaseStock(productId, quantity);
    }

    @Get('alerts/low-stock')
    @ApiOperation({ summary: 'Get all low stock items' })
    async getLowStockItems() {
        return this.inventoryService.getLowStockItems();
    }

    @Get('summary/overview')
    @ApiOperation({ summary: 'Get inventory summary' })
    async getInventorySummary() {
        return this.inventoryService.getInventorySummary();
    }
}
