import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Sale } from '../sales/entities/sale.entity';

export interface UserDataExport {
    user: Partial<User>;
    sales: Sale[];
    consents: {
        marketing: boolean;
        analytics: boolean;
        updatedAt: Date | null;
    };
    exportedAt: Date;
}

@Injectable()
export class PrivacyService {
    private readonly logger = new Logger(PrivacyService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) { }

    /**
     * GDPR Article 20 - Right to data portability
     * Export all user data in a machine-readable format
     */
    async exportUserData(userId: string): Promise<UserDataExport> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Get user's sales (by customer email for now)
        const sales = await this.saleRepository.find({
            where: { customerEmail: user.email },
            order: { saleDate: 'DESC' },
        });

        // Mark export request
        user.dataExportRequestedAt = new Date();
        await this.userRepository.save(user);

        this.logger.log(`Data export generated for user ${userId}`);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
            },
            sales: sales.map((s) => ({
                ...s,
                customerEmail: undefined, // Exclude email from sales for privacy
            })),
            consents: {
                marketing: user.marketingConsent,
                analytics: user.analyticsConsent,
                updatedAt: user.consentUpdatedAt,
            },
            exportedAt: new Date(),
        };
    }

    /**
     * GDPR Article 17 - Right to erasure (Right to be forgotten)
     * Anonymize or delete all user data
     */
    async deleteUserData(userId: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Anonymize sales data (required for business records)
        await this.saleRepository.update(
            { customerEmail: user.email },
            { customerEmail: null, customerId: null },
        );

        // Delete user account
        await this.userRepository.remove(user);

        this.logger.log(`User data deleted for user ${userId}`);

        return {
            success: true,
            message: 'User data has been deleted. Sales records have been anonymized for regulatory compliance.',
        };
    }

    /**
     * Update user consent preferences
     */
    async updateConsent(
        userId: string,
        consents: { marketing?: boolean; analytics?: boolean },
    ): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (consents.marketing !== undefined) {
            user.marketingConsent = consents.marketing;
        }
        if (consents.analytics !== undefined) {
            user.analyticsConsent = consents.analytics;
        }
        user.consentUpdatedAt = new Date();

        this.logger.log(`Consent updated for user ${userId}`);

        return this.userRepository.save(user);
    }

    /**
     * Get user's consent status
     */
    async getConsentStatus(userId: string): Promise<{
        marketing: boolean;
        analytics: boolean;
        updatedAt: Date | null;
    }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            marketing: user.marketingConsent,
            analytics: user.analyticsConsent,
            updatedAt: user.consentUpdatedAt,
        };
    }

    /**
     * Get privacy policy summary
     */
    getPrivacyPolicySummary(): {
        dataCollected: string[];
        purposes: string[];
        retention: string;
        rights: string[];
    } {
        return {
            dataCollected: [
                'Email address',
                'Name',
                'Purchase history',
                'Analytics data (if consented)',
            ],
            purposes: [
                'Account management',
                'Order processing',
                'Service improvement',
                'Marketing (with consent)',
            ],
            retention: 'Account data retained until deletion requested. Sales records anonymized and retained for 7 years for regulatory compliance.',
            rights: [
                'Access your data (Art. 15)',
                'Rectify your data (Art. 16)',
                'Erase your data (Art. 17)',
                'Data portability (Art. 20)',
                'Withdraw consent at any time',
            ],
        };
    }
}
