import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
export declare class BankAccountsController {
    private readonly bankAccountsService;
    constructor(bankAccountsService: BankAccountsService);
    create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount>;
    findAll(is_active?: boolean, account_type?: string): Promise<BankAccount[]>;
    getMainAccount(): Promise<BankAccount>;
    getTotalBalance(): Promise<{
        total_current_balance: number;
        total_available_balance: number;
        account_count: number;
        currency_breakdown: Record<string, number>;
    }>;
    findOne(id: string): Promise<BankAccount>;
    findByAccountNumber(accountNumber: string): Promise<BankAccount>;
    update(id: string, updateData: Partial<CreateBankAccountDto>): Promise<BankAccount>;
    updateBalance(id: string, body: {
        balance: number;
        balance_type?: 'current' | 'available' | 'ledger';
    }): Promise<BankAccount>;
    deactivate(id: string): Promise<BankAccount>;
    validateTransaction(id: string, body: {
        amount: number;
        transaction_type: 'debit' | 'credit';
    }): Promise<{
        valid: boolean;
        message?: string;
    }>;
}
