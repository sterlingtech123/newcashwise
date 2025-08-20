import { BaseEntity } from '../../common/entities/base.entity';
import { JournalEntry } from './journal-entry.entity';
import { GLAccount } from '../../gl-accounts/entities/gl-account.entity';
export declare class JournalEntryLine extends BaseEntity {
    journal_entry_id: string;
    gl_account_id: string;
    line_date: Date;
    description: string;
    debit_amount: number;
    credit_amount: number;
    reference_data: any;
    notes: string;
    journal_entry: JournalEntry;
    gl_account: GLAccount;
    getAmount(): number;
    isDebit(): boolean;
}
