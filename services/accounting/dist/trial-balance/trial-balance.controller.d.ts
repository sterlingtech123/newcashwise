import { TrialBalanceService, TrialBalanceEntry, FinancialStatement } from './trial-balance.service';
export declare class TrialBalanceController {
    private readonly trialBalanceService;
    constructor(trialBalanceService: TrialBalanceService);
    generateTrialBalance(periodStart: string, periodEnd: string, accountTypes?: string[]): Promise<TrialBalanceEntry[]>;
    generateFinancialStatements(periodStart: string, periodEnd: string): Promise<FinancialStatement>;
    saveSnapshot(body: {
        period_end_date: string;
        entries: TrialBalanceEntry[];
    }): Promise<void>;
    getHistory(startDate: string, endDate: string): Promise<import("./entities/trial-balance.entity").TrialBalanceSnapshot[]>;
    validateTrialBalance(body: {
        entries: TrialBalanceEntry[];
    }): Promise<{
        isBalanced: boolean;
        totalDebits: number;
        totalCredits: number;
        difference: number;
    }>;
}
