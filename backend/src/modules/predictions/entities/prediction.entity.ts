import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

export enum PredictionType {
    SALES_FORECAST = 'sales_forecast',
    INVENTORY_RECOMMENDATION = 'inventory_recommendation',
    DEMAND_PREDICTION = 'demand_prediction',
}

@Entity('predictions')
@Index(['productId', 'predictionDate'])
@Index(['predictionType'])
export class Prediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: true })
    productId: string;

    @Column({
        type: 'enum',
        enum: PredictionType,
        default: PredictionType.SALES_FORECAST,
    })
    predictionType: PredictionType;

    @Column('int')
    predictedValue: number;

    @Column('decimal', { precision: 5, scale: 4, nullable: true })
    confidenceScore: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    predictedRevenue: number;

    @Column('date')
    predictionDate: Date;

    @Column('jsonb', { nullable: true })
    factors: Record<string, any>;

    @Column('jsonb', { nullable: true })
    modelMetadata: {
        modelVersion: string;
        trainedAt: Date;
        accuracy: number;
        features: string[];
    };

    @CreateDateColumn()
    createdAt: Date;
}
