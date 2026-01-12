import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: (configService: ConfigService) => {
                return new Redis({
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                    password: configService.get('REDIS_PASSWORD', undefined),
                    retryDelayOnFailover: 100,
                    maxRetriesPerRequest: 3,
                });
            },
            inject: [ConfigService],
        },
        CacheService,
    ],
    exports: [REDIS_CLIENT, CacheService],
})
export class CacheModule { }
