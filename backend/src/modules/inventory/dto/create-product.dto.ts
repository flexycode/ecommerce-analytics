import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'Unique SKU for the product' })
    @IsString()
    sku: string;

    @ApiProperty({ description: 'Product name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Product description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Selling price' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ description: 'Cost price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiProperty({ description: 'Product category' })
    @IsString()
    category: string;

    @ApiPropertyOptional({ description: 'Product subcategory' })
    @IsOptional()
    @IsString()
    subcategory?: string;

    @ApiPropertyOptional({ description: 'Brand name' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ description: 'Product tags', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: 'Product image URL' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ description: 'Is product active', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
