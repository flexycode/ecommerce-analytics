import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    Index,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('products')
@Index(['sku'], { unique: true })
@Index(['category'])
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    sku: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    costPrice: number;

    @Column()
    category: string;

    @Column({ nullable: true })
    subcategory: string;

    @Column({ nullable: true })
    brand: string;

    @Column('varchar', { array: true, nullable: true })
    tags: string[];

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => Inventory, (inventory) => inventory.product)
    inventory: Inventory;

    @Column('jsonb', { nullable: true })
    attributes: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
