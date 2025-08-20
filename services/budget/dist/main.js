"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:3100'],
        credentials: true,
    });
    if (configService.get('NODE_ENV') !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('CashWise Budget Service')
            .setDescription('Budget Management and Encumbrance Accounting API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: 'budget-service',
                brokers: configService.get('KAFKA_BROKERS')?.split(',') || ['localhost:9092'],
            },
            consumer: {
                groupId: 'budget-consumer-group',
            },
        },
    });
    await app.startAllMicroservices();
    const port = configService.get('PORT', 3003);
    await app.listen(port);
    logger.log(`Budget Service listening on port ${port}`);
    logger.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map