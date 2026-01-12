import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryDto {
    @ApiPropertyOptional({ description: 'Current stock level' })
    @IsOptional()
    @IsInt()
    @Min(0)
    currentStock?: number;

    @ApiPropertyOptional({ description: 'Reserved stock' })
    @IsOptional()
    @IsInt()
    @Min(0)
    reservedStock?: number;

    @ApiPropertyOptional({ description: 'Reorder level threshold' })
    @IsOptional()
    @IsInt()
    @Min(0)
    reorderLevel?: number;

    @ApiPropertyOptional({ description: 'Quantity to order when restocking' })
    @IsOptional()
    @IsInt()
    @Min(1)
    reorderQuantity?: number;

    @ApiPropertyOptional({ description: 'Maximum stock level' })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxStock?: number;

    @ApiPropertyOptional({ description: 'Storage location' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ description: 'Warehouse identifier' })
    @IsOptional()
    @IsString()
    warehouse?: string;
}
