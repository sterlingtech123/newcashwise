import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class BankAccountsService {
    private bankAccountRepository;
    private tenantService;
    private auditService;
    constructor(bankAccountRepository: Repository<BankAccount>, tenantService: TenantService, auditService: AuditService);
    create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount>;
    findAll(filters?: {
        is_active?: boolean;
        account_type?: string;
    }): Promise<BankAccount[]>;
    findOne(id: string): Promise<BankAccount>;
    findByAccountNumber(accountNumber: string): Promise<BankAccount>;
    update(id: string, updateData: Partial<CreateBankAccountDto>): Promise<BankAccount>;
    updateBalance(accountId: string, newBalance: number, balanceType?: 'current' | 'available' | 'ledger'): Promise<BankAccount>;
    deactivate(id: string): Promise<BankAccount>;
    getMainAccount(): Promise<BankAccount>;
    getTotalBalance(): Promise<{
        total_current_balance: number;
        total_available_balance: number;
        account_count: number;
        currency_breakdown: Record<string, number>;
    }>;
    validateAccountForTransaction(accountId: string, amount: number, transactionType: 'debit' | 'credit'): Promise<{
        valid: boolean;
        message?: string;
    }>;
}
