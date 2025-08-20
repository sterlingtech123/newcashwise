"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const axios_1 = require("@nestjs/axios");
const bank_accounts_module_1 = require("./bank-accounts/bank-accounts.module");
const transactions_module_1 = require("./transactions/transactions.module");
const reconciliation_module_1 = require("./reconciliation/reconciliation.module");
const statements_module_1 = require("./statements/statements.module");
const treasury_module_1 = require("./treasury/treasury.module");
const cash_management_module_1 = require("./cash-management/cash-management.module");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_NAME', 'cashwise'),
                    schema: configService.get('DB_SCHEMA', 'bank'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    extra: {
                        max: 20,
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 2000,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            axios_1.HttpModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    timeout: configService.get('HTTP_TIMEOUT', 5000),
                    maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            common_module_1.CommonModule,
            bank_accounts_module_1.BankAccountsModule,
            transactions_module_1.TransactionsModule,
            reconciliation_module_1.ReconciliationModule,
            statements_module_1.StatementsModule,
            treasury_module_1.TreasuryModule,
            cash_management_module_1.CashManagementModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map