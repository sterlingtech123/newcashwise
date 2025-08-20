import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getBalanceSheet(asOfDate: string): Promise<{
        assets: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        liabilities: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        equity: import("../chart-of-accounts/chart-of-accounts.service").ChartNode[];
        total_assets: number;
        total_liabilities: number;
        total_equity: number;
    }>;
    getIncomeStatement(startDate: string, endDate: string): Promise<{
        period_start: Date;
        period_end: Date;
        total_revenue: number;
        total_expenses: number;
        net_income: number;
        revenue_accounts: import("../trial-balance/trial-balance.service").TrialBalanceEntry[];
        expense_accounts: import("../trial-balance/trial-balance.service").TrialBalanceEntry[];
    }>;
    getCashFlowStatement(startDate: string, endDate: string): Promise<{
        period_start: Date;
        period_end: Date;
        operating_activities: number;
        investing_activities: number;
        financing_activities: number;
        net_cash_flow: number;
    }>;
}
