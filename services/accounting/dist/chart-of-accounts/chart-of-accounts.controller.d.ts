import { ChartOfAccountsService } from './chart-of-accounts.service';
export declare class ChartOfAccountsController {
    private readonly chartOfAccountsService;
    constructor(chartOfAccountsService: ChartOfAccountsService);
    getHierarchy(): Promise<import("./chart-of-accounts.service").ChartNode[]>;
    getByType(type: string): Promise<import("../gl-accounts/entities/gl-account.entity").GLAccount[]>;
    getBalanceSheet(): Promise<{
        assets: import("./chart-of-accounts.service").ChartNode[];
        liabilities: import("./chart-of-accounts.service").ChartNode[];
        equity: import("./chart-of-accounts.service").ChartNode[];
        total_assets: number;
        total_liabilities: number;
        total_equity: number;
    }>;
    getIncomeStatement(): Promise<{
        revenue: import("./chart-of-accounts.service").ChartNode[];
        expenses: import("./chart-of-accounts.service").ChartNode[];
        total_revenue: number;
        total_expenses: number;
        net_income: number;
    }>;
    searchAccounts(query: string): Promise<import("../gl-accounts/entities/gl-account.entity").GLAccount[]>;
    validateStructure(): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
}
