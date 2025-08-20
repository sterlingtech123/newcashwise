import { Repository } from 'typeorm';
import { TrialBalanceSnapshot } from './entities/trial-balance.entity';
import { GLAccount } from '../gl-accounts/entities/gl-account.entity';
import { JournalEntryLine } from '../journal-entries/entities/journal-entry-line.entity';
import { TenantService } from '../common/services/tenant.service';
export interface TrialBalanceEntry {
    account_code: string;
    account_name: string;
    account_type: string;
    debit_balance: number;
    credit_balance: number;
    net_balance: number;
}
export interface FinancialStatement {
    period_start: Date;
    period_end: Date;
    total_assets: number;
    total_liabilities: number;
    total_equity: number;
    total_revenue: number;
    total_expenses: number;
    net_income: number;
    entries: TrialBalanceEntry[];
}
export declare class TrialBalanceService {
    private trialBalanceRepository;
    private glAccountRepository;
    private journalEntryLineRepository;
    private tenantService;
    constructor(trialBalanceRepository: Repository<TrialBalanceSnapshot>, glAccountRepository: Repository<GLAccount>, journalEntryLineRepository: Repository<JournalEntryLine>, tenantService: TenantService);
    generateTrialBalance(periodStart: Date, periodEnd: Date, accountTypes?: string[]): Promise<TrialBalanceEntry[]>;
    generateFinancialStatements(periodStart: Date, periodEnd: Date): Promise<FinancialStatement>;
    saveTrialBalanceSnapshot(periodEndDate: Date, entries: TrialBalanceEntry[]): Promise<void>;
    getTrialBalanceHistory(startDate: Date, endDate: Date): Promise<TrialBalanceSnapshot[]>;
    validateTrialBalance(entries: TrialBalanceEntry[]): Promise<{
        isBalanced: boolean;
        totalDebits: number;
        totalCredits: number;
        difference: number;
    }>;
    private calculatePeriodActivity;
    private calculateOpeningBalance;
}
