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
        .setTitle('CashWise Notification Service')
        .setDescription('Notification and communication management API for the CashWise platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Notifications', 'Notification management')
        .addTag('Templates', 'Template management')
        .addTag('Preferences', 'User notification preferences')
        .addTag('Channels', 'Communication channels')
        .addTag('Events', 'Event-driven notifications')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3007;
    await app.listen(port);
    console.log(`📢 Notification Service running on port ${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map