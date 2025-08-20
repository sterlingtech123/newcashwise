import { TransactionsService } from './transactions.service';
import { CreateBankTransactionDto } from './dto/create-bank-transaction.dto';
import { BankTransaction } from './entities/bank-transaction.entity';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateBankTransactionDto): Promise<BankTransaction>;
    findAll(page?: number, limit?: number, bank_account_id?: string, transaction_type?: string, status?: string, reconciliation_status?: string, date_from?: string, date_to?: string, category?: string): Promise<{
        data: BankTransaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BankTransaction>;
    reverseTransaction(id: string, body: {
        reason: string;
    }): Promise<BankTransaction>;
    getAccountStatement(accountId: string, startDate: string, endDate: string): Promise<{
        account: import("../bank-accounts/entities/bank-account.entity").BankAccount;
        opening_balance: number;
        closing_balance: number;
        transactions: BankTransaction[];
        total_credits: number;
        total_debits: number;
    }>;
    updateReconciliationStatus(id: string, body: {
        status: string;
        reconciled_by?: string;
    }): Promise<BankTransaction>;
}
