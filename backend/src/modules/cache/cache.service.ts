import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './cache.module';

@Injectable()
export class CacheService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    /**
     * Store a value in cache with optional TTL
     */
    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        const serialized = JSON.stringify(value);
        if (ttlSeconds) {
            await this.redis.setex(key, ttlSeconds, serialized);
        } else {
            await this.redis.set(key, serialized);
        }
    }

    /**
     * Retrieve a value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    }

    /**
     * Delete a key from cache
     */
    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

    /**
     * Delete all keys matching a pattern
     */
    async deletePattern(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    /**
     * Store hash data
     */
    async hset(key: string, field: string, value: any): Promise<void> {
        await this.redis.hset(key, field, JSON.stringify(value));
    }

    /**
     * Get hash field
     */
    async hget<T>(key: string, field: string): Promise<T | null> {
        const data = await this.redis.hget(key, field);
        if (!data) return null;
        return JSON.parse(data) as T;
    }

    /**
     * Get all hash fields
     */
    async hgetall<T>(key: string): Promise<Record<string, T>> {
        const data = await this.redis.hgetall(key);
        const result: Record<string, T> = {};
        for (const [field, value] of Object.entries(data)) {
            result[field] = JSON.parse(value) as T;
        }
        return result;
    }

    /**
     * Publish message to a channel (for real-time updates)
     */
    async publish(channel: string, message: any): Promise<void> {
        await this.redis.publish(channel, JSON.stringify(message));
    }

    /**
     * Increment a counter
     */
    async incr(key: string): Promise<number> {
        return await this.redis.incr(key);
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        const result = await this.redis.exists(key);
        return result === 1;
    }
}
