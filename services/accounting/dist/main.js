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
        .setTitle('CashWise Accounting & GL Service')
        .setDescription('General Ledger and Accounting API for the CashWise platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Journal Entries', 'Journal entry management')
        .addTag('Chart of Accounts', 'Chart of accounts management')
        .addTag('Trial Balance', 'Trial balance and financial statements')
        .addTag('GL Accounts', 'General ledger account operations')
        .addTag('Reconciliation', 'Account reconciliation')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3005;
    await app.listen(port);
    console.log(`🚀 Accounting Service running on port ${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map