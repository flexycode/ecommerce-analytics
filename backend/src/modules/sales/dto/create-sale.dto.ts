import { IsUUID, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDto {
    @ApiProperty({ description: 'Product ID' })
    @IsUUID()
    productId: string;

    @ApiProperty({ description: 'Quantity sold', minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: 'Unit price per item' })
    @IsNumber()
    @Min(0)
    unitPrice: number;

    @ApiPropertyOptional({ description: 'Customer ID' })
    @IsOptional()
    @IsUUID()
    customerId?: string;

    @ApiPropertyOptional({ description: 'Customer email' })
    @IsOptional()
    @IsString()
    customerEmail?: string;

    @ApiPropertyOptional({ description: 'Payment method', example: 'credit_card' })
    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @ApiPropertyOptional({ description: 'Sales channel', example: 'web' })
    @IsOptional()
    @IsString()
    channel?: string;
}
