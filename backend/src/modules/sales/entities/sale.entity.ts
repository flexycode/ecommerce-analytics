import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from '../../inventory/entities/product.entity';

@Entity('sales')
@Index(['saleDate'])
@Index(['productId'])
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    productId: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column('uuid', { nullable: true })
    customerId: string;

    @Column({ nullable: true })
    customerEmail: string;

    @Column({ default: 'completed' })
    status: string;

    @Column('varchar', { nullable: true })
    paymentMethod: string;

    @Column('varchar', { nullable: true })
    channel: string; // web, mobile, pos

    @Column('jsonb', { nullable: true })
    metadata: Record<string, any>;

    @Column('timestamp')
    @Index()
    saleDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
