"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reconciliation_service_1 = require("./reconciliation.service");
const reconciliation_controller_1 = require("./reconciliation.controller");
const reconciliation_entity_1 = require("./entities/reconciliation.entity");
const reconciliation_item_entity_1 = require("./entities/reconciliation-item.entity");
const bank_account_entity_1 = require("../bank-accounts/entities/bank-account.entity");
const bank_transaction_entity_1 = require("../transactions/entities/bank-transaction.entity");
const audit_log_entity_1 = require("../common/entities/audit-log.entity");
let ReconciliationModule = class ReconciliationModule {
};
exports.ReconciliationModule = ReconciliationModule;
exports.ReconciliationModule = ReconciliationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reconciliation_entity_1.Reconciliation,
                reconciliation_item_entity_1.ReconciliationItem,
                bank_account_entity_1.BankAccount,
                bank_transaction_entity_1.BankTransaction,
                audit_log_entity_1.AuditLog,
            ]),
        ],
        controllers: [reconciliation_controller_1.ReconciliationController],
        providers: [reconciliation_service_1.ReconciliationService],
        exports: [reconciliation_service_1.ReconciliationService],
    })
], ReconciliationModule);
//# sourceMappingURL=reconciliation.module.js.map