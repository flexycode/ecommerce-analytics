import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    ANALYST = 'analyst',
    VIEWER = 'viewer',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VIEWER,
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    lastLoginAt: Date;

    // GDPR Compliance fields
    @Column({ default: false })
    marketingConsent: boolean;

    @Column({ default: false })
    analyticsConsent: boolean;

    @Column({ nullable: true })
    consentUpdatedAt: Date;

    @Column({ nullable: true })
    dataExportRequestedAt: Date;

    @Column({ nullable: true })
    deletionRequestedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Virtual property
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
