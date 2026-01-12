import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';
import { User } from '../auth/entities/user.entity';
import { Sale } from '../sales/entities/sale.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Sale])],
    controllers: [PrivacyController],
    providers: [PrivacyService],
    exports: [PrivacyService],
})
export class PrivacyModule { }
