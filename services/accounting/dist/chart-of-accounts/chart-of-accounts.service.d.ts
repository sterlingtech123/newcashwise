import { GLAccountsService } from '../gl-accounts/gl-accounts.service';
import { GLAccount } from '../gl-accounts/entities/gl-account.entity';
export interface ChartNode {
    account: GLAccount;
    children: ChartNode[];
    level: number;
    path: string[];
}
export declare class ChartOfAccountsService {
    private readonly glAccountsService;
    constructor(glAccountsService: GLAccountsService);
    getHierarchicalChart(): Promise<ChartNode[]>;
    getAccountsByType(accountType: string): Promise<GLAccount[]>;
    getBalanceSheet(): Promise<{
        assets: ChartNode[];
        liabilities: ChartNode[];
        equity: ChartNode[];
        total_assets: number;
        total_liabilities: number;
        total_equity: number;
    }>;
    getIncomeStatement(): Promise<{
        revenue: ChartNode[];
        expenses: ChartNode[];
        total_revenue: number;
        total_expenses: number;
        net_income: number;
    }>;
    searchAccounts(query: string): Promise<GLAccount[]>;
    validateChartStructure(): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    private buildChartNode;
    private filterByAccountType;
    private calculateTotal;
    private hasCircularReference;
}
