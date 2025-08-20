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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const trial_balance_service_1 = require("../trial-balance/trial-balance.service");
const chart_of_accounts_service_1 = require("../chart-of-accounts/chart-of-accounts.service");
const tenant_service_1 = require("../common/services/tenant.service");
let ReportsService = class ReportsService {
    constructor(trialBalanceService, chartOfAccountsService, tenantService) {
        this.trialBalanceService = trialBalanceService;
        this.chartOfAccountsService = chartOfAccountsService;
        this.tenantService = tenantService;
    }
    async generateBalanceSheet(asOfDate) {
        return this.chartOfAccountsService.getBalanceSheet();
    }
    async generateIncomeStatement(startDate, endDate) {
        const financialStatements = await this.trialBalanceService.generateFinancialStatements(startDate, endDate);
        return {
            period_start: startDate,
            period_end: endDate,
            total_revenue: financialStatements.total_revenue,
            total_expenses: financialStatements.total_expenses,
            net_income: financialStatements.net_income,
            revenue_accounts: financialStatements.entries.filter(e => e.account_type === 'revenue'),
            expense_accounts: financialStatements.entries.filter(e => e.account_type === 'expense'),
        };
    }
    async generateCashFlowStatement(startDate, endDate) {
        return {
            period_start: startDate,
            period_end: endDate,
            operating_activities: 0,
            investing_activities: 0,
            financing_activities: 0,
            net_cash_flow: 0,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trial_balance_service_1.TrialBalanceService,
        chart_of_accounts_service_1.ChartOfAccountsService,
        tenant_service_1.TenantService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map