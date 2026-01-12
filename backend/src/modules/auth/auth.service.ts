import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: Partial<User> }> {
        const { email, password, firstName, lastName } = registerDto;

        // Check if user exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        await this.userRepository.save(user);

        // Generate token
        const accessToken = this.generateToken(user);

        return {
            accessToken,
            user: this.sanitizeUser(user),
        };
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);

        const accessToken = this.generateToken(user);

        return {
            accessToken,
            user: this.sanitizeUser(user),
        };
    }

    async validateUser(userId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: userId, isActive: true } });
    }

    async getUserById(userId: string): Promise<Partial<User> | null> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        return user ? this.sanitizeUser(user) : null;
    }

    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }

    private sanitizeUser(user: User): Partial<User> {
        const { password, ...sanitized } = user;
        return sanitized;
    }
}
