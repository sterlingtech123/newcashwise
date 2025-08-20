"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryService = void 0;
const common_1 = require("@nestjs/common");
const bank_accounts_service_1 = require("../bank-accounts/bank-accounts.service");
const transactions_service_1 = require("../transactions/transactions.service");
const tenant_service_1 = require("../common/services/tenant.service");
let TreasuryService = class TreasuryService {
    constructor(bankAccountsService, transactionsService, tenantService) {
        this.bankAccountsService = bankAccountsService;
        this.transactionsService = transactionsService;
        this.tenantService = tenantService;
    }
    async getCashPosition() {
        const totalBalance = await this.bankAccountsService.getTotalBalance();
        return {
            ...totalBalance,
            position_date: new Date(),
            status: 'current',
        };
    }
    async getCashForecast(days = 30) {
        const currentPosition = await this.getCashPosition();
        return {
            current_position: currentPosition.total_current_balance,
            forecast_days: days,
            projected_balance: currentPosition.total_current_balance,
            forecast_data: [],
            risk_alerts: [],
        };
    }
    async getLiquidityAnalysis() {
        const accounts = await this.bankAccountsService.findAll({ is_active: true });
        let totalLiquid = 0;
        let totalRestricted = 0;
        let totalMinimumRequired = 0;
        accounts.forEach(account => {
            totalLiquid += Number(account.available_balance || account.current_balance);
            totalMinimumRequired += Number(account.minimum_balance || 0);
        });
        const excessLiquidity = totalLiquid - totalMinimumRequired;
        return {
            total_liquid_funds: totalLiquid,
            total_restricted_funds: totalRestricted,
            minimum_required: totalMinimumRequired,
            excess_liquidity: excessLiquidity,
            liquidity_ratio: totalMinimumRequired > 0 ? totalLiquid / totalMinimumRequired : null,
            analysis_date: new Date(),
        };
    }
};
exports.TreasuryService = TreasuryService;
exports.TreasuryService = TreasuryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bank_accounts_service_1.BankAccountsService,
        transactions_service_1.TransactionsService,
        tenant_service_1.TenantService])
], TreasuryService);
//# sourceMappingURL=treasury.service.js.map