import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // CORS configuration
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Swagger API documentation
    const config = new DocumentBuilder()
        .setTitle('E-commerce Analytics API')
        .setDescription('Real-time analytics platform with AI-powered predictions')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('analytics', 'Real-time analytics endpoints')
        .addTag('sales', 'Sales data management')
        .addTag('inventory', 'Inventory tracking and management')
        .addTag('predictions', 'AI-powered sales predictions')
        .addTag('auth', 'Authentication and authorization')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
