"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementsModule = void 0;
const common_1 = require("@nestjs/common");
const statements_service_1 = require("./statements.service");
const statements_controller_1 = require("./statements.controller");
const bank_accounts_module_1 = require("../bank-accounts/bank-accounts.module");
const transactions_module_1 = require("../transactions/transactions.module");
let StatementsModule = class StatementsModule {
};
exports.StatementsModule = StatementsModule;
exports.StatementsModule = StatementsModule = __decorate([
    (0, common_1.Module)({
        imports: [bank_accounts_module_1.BankAccountsModule, transactions_module_1.TransactionsModule],
        controllers: [statements_controller_1.StatementsController],
        providers: [statements_service_1.StatementsService],
        exports: [statements_service_1.StatementsService],
    })
], StatementsModule);
//# sourceMappingURL=statements.module.js.map