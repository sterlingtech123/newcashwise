import { ReconciliationService } from './reconciliation.service';
import { Reconciliation } from './entities/reconciliation.entity';
export declare class ReconciliationController {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    startReconciliation(body: {
        bank_account_id: string;
        period_start_date: string;
        period_end_date: string;
        statement_opening_balance: number;
        statement_closing_balance: number;
        statement_reference?: string;
        statement_date?: string;
    }): Promise<Reconciliation>;
    addStatementItems(id: string, body: {
        items: Array<{
            date: string;
            description: string;
            amount: number;
            type: 'credit' | 'debit';
            reference?: string;
            statement_data?: any;
        }>;
    }): Promise<Reconciliation>;
    performAutoMatching(id: string): Promise<void>;
    matchItems(itemId: string, body: {
        statement_item_id: string;
        reason?: string;
    }): Promise<void>;
    unmatchItems(itemId: string): Promise<void>;
    completeReconciliation(id: string): Promise<Reconciliation>;
    findAll(bank_account_id?: string, status?: string, date_from?: string, date_to?: string): Promise<Reconciliation[]>;
    findOne(id: string): Promise<Reconciliation>;
}
