import { Repository, DataSource } from 'typeorm';
import { BankTransaction } from './entities/bank-transaction.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';
import { CreateBankTransactionDto } from './dto/create-bank-transaction.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class TransactionsService {
    private transactionRepository;
    private bankAccountRepository;
    private dataSource;
    private tenantService;
    private auditService;
    constructor(transactionRepository: Repository<BankTransaction>, bankAccountRepository: Repository<BankAccount>, dataSource: DataSource, tenantService: TenantService, auditService: AuditService);
    create(createTransactionDto: CreateBankTransactionDto): Promise<BankTransaction>;
    findAll(page?: number, limit?: number, filters?: {
        bank_account_id?: string;
        transaction_type?: string;
        status?: string;
        reconciliation_status?: string;
        date_from?: string;
        date_to?: string;
        category?: string;
    }): Promise<{
        data: BankTransaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BankTransaction>;
    reverseTransaction(id: string, reason: string): Promise<BankTransaction>;
    getAccountStatement(accountId: string, startDate: Date, endDate: Date): Promise<{
        account: BankAccount;
        opening_balance: number;
        closing_balance: number;
        transactions: BankTransaction[];
        total_credits: number;
        total_debits: number;
    }>;
    updateReconciliationStatus(transactionId: string, status: string, reconciledBy?: string): Promise<BankTransaction>;
    private validateDebitTransaction;
    private generateReferenceNumber;
}
