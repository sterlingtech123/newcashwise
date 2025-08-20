import { Repository, DataSource } from 'typeorm';
import { Reconciliation } from './entities/reconciliation.entity';
import { ReconciliationItem } from './entities/reconciliation-item.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';
import { BankTransaction } from '../transactions/entities/bank-transaction.entity';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
interface CreateReconciliationDto {
    bank_account_id: string;
    period_start_date: string;
    period_end_date: string;
    statement_opening_balance: number;
    statement_closing_balance: number;
    statement_reference?: string;
    statement_date?: string;
}
interface StatementItem {
    date: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    reference?: string;
    statement_data?: any;
}
export declare class ReconciliationService {
    private reconciliationRepository;
    private reconciliationItemRepository;
    private bankAccountRepository;
    private transactionRepository;
    private dataSource;
    private tenantService;
    private auditService;
    constructor(reconciliationRepository: Repository<Reconciliation>, reconciliationItemRepository: Repository<ReconciliationItem>, bankAccountRepository: Repository<BankAccount>, transactionRepository: Repository<BankTransaction>, dataSource: DataSource, tenantService: TenantService, auditService: AuditService);
    startReconciliation(createDto: CreateReconciliationDto): Promise<Reconciliation>;
    addStatementItems(reconciliationId: string, statementItems: StatementItem[]): Promise<Reconciliation>;
    performAutoMatching(reconciliationId: string): Promise<void>;
    matchItems(bookItemId: string, statementItemId: string, reason?: string): Promise<void>;
    unmatchItems(itemId: string): Promise<void>;
    completeReconciliation(reconciliationId: string): Promise<Reconciliation>;
    findAll(filters?: {
        bank_account_id?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    }): Promise<Reconciliation[]>;
    findOne(id: string): Promise<Reconciliation>;
    private loadBookTransactions;
    private calculateBookBalance;
    private updateReconciliationStats;
}
export {};
