import { BaseEntity } from '../../common/entities/base.entity';
import { JournalEntryLine } from './journal-entry-line.entity';
export declare class JournalEntry extends BaseEntity {
    entry_date: Date;
    reference_number: string;
    description: string;
    source_type: string;
    source_id: string;
    total_debit: number;
    total_credit: number;
    status: string;
    notes: string;
    posted_by: string;
    posted_at: Date;
    reversed_by: string;
    reversed_at: Date;
    reversal_reason: string;
    lines: JournalEntryLine[];
    validateBalance(): boolean;
}
