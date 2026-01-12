import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('inventory')
@Index(['productId'], { unique: true })
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    productId: string;

    @OneToOne(() => Product, (product) => product.inventory, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column('int', { default: 0 })
    currentStock: number;

    @Column('int', { default: 0 })
    reservedStock: number;

    @Column('int', { default: 10 })
    reorderLevel: number;

    @Column('int', { default: 50 })
    reorderQuantity: number;

    @Column('int', { nullable: true })
    maxStock: number;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    warehouse: string;

    @Column({ default: false })
    isLowStock: boolean;

    @Column({ nullable: true })
    lastRestockDate: Date;

    @Column({ nullable: true })
    nextRestockDate: Date;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    turnoverRate: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Computed available stock
    get availableStock(): number {
        return this.currentStock - this.reservedStock;
    }
}
