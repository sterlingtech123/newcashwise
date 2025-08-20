import { BaseEntity } from '../../common/entities/base.entity';
import { BankTransaction } from '../../transactions/entities/bank-transaction.entity';
export declare class BankAccount extends BaseEntity {
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    branch_name: string;
    branch_code: string;
    currency: string;
    account_type: string;
    current_balance: number;
    available_balance: number;
    ledger_balance: number;
    minimum_balance: number;
    overdraft_limit: number;
    is_active: boolean;
    is_main_account: boolean;
    last_reconciled_date: Date;
    last_statement_date: Date;
    bank_connection_config: any;
    description: string;
    metadata: any;
    transactions: BankTransaction[];
    getAvailableBalance(): number;
    canDebit(amount: number): boolean;
    isOverdrawn(): boolean;
    getEffectiveBalance(): number;
}
