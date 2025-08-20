"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashManagementModule = void 0;
const common_1 = require("@nestjs/common");
const cash_management_service_1 = require("./cash-management.service");
const cash_management_controller_1 = require("./cash-management.controller");
const bank_accounts_module_1 = require("../bank-accounts/bank-accounts.module");
let CashManagementModule = class CashManagementModule {
};
exports.CashManagementModule = CashManagementModule;
exports.CashManagementModule = CashManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [bank_accounts_module_1.BankAccountsModule],
        controllers: [cash_management_controller_1.CashManagementController],
        providers: [cash_management_service_1.CashManagementService],
        exports: [cash_management_service_1.CashManagementService],
    })
], CashManagementModule);
//# sourceMappingURL=cash-management.module.js.map