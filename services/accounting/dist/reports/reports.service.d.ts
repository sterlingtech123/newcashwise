import { TrialBalanceService } from '../trial-balance/trial-balance.service';
import { ChartOfAccountsService } from '../chart-of-accounts/chart-of-accounts.service';
import { TenantService } from '../common/services/tenant.service';
export declare class ReportsService {
    private trialBalanceService;
    private chartOfAccountsService;
    private tenantService;
    constructor(trialBalanceService: TrialBalanceService, chartOfAccountsService: ChartOfAccountsService, tenantService: TenantService);
    generateBalanceSheet(asOfDate: Date): Promise<{
        assets: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        liabilities: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        equity: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        total_assets: number;
        total_liabilities: number;
        total_equity: number;
    }>;
    generateIncomeStatement(startDate: Date, endDate: Date): Promise<{
        period_start: Date;
        period_end: Date;
        total_revenue: number;
        total_expenses: number;
        net_income: number;
        revenue_accounts: import("../trial-balance/trial-balance.service").TrialBalanceEntry[];
        expense_accounts: import("../trial-balance/trial-balance.service").TrialBalanceEntry[];
    }>;
    generateCashFlowStatement(startDate: Date, endDate: Date): Promise<{
        period_start: Date;
        period_end: Date;
        operating_activities: number;
        investing_activities: number;
        financing_activities: number;
        net_cash_flow: number;
    }>;
}
