"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bank_accounts_service_1 = require("./bank-accounts.service");
const bank_accounts_controller_1 = require("./bank-accounts.controller");
const bank_account_entity_1 = require("./entities/bank-account.entity");
const audit_log_entity_1 = require("../common/entities/audit-log.entity");
let BankAccountsModule = class BankAccountsModule {
};
exports.BankAccountsModule = BankAccountsModule;
exports.BankAccountsModule = BankAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                bank_account_entity_1.BankAccount,
                audit_log_entity_1.AuditLog,
            ]),
        ],
        controllers: [bank_accounts_controller_1.BankAccountsController],
        providers: [bank_accounts_service_1.BankAccountsService],
        exports: [bank_accounts_service_1.BankAccountsService],
    })
], BankAccountsModule);
//# sourceMappingURL=bank-accounts.module.js.map