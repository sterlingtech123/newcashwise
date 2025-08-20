"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CashWise Bank & Treasury Service')
        .setDescription('Bank account management, reconciliation, and treasury operations API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Bank Accounts', 'Bank account management')
        .addTag('Transactions', 'Bank transaction processing')
        .addTag('Reconciliation', 'Bank reconciliation operations')
        .addTag('Treasury', 'Cash management and forecasting')
        .addTag('Statements', 'Bank statement processing')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3006;
    await app.listen(port);
    console.log(`🏦 Bank & Treasury Service running on port ${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map