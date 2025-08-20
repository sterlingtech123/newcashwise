export declare class CreateJournalEntryLineDto {
    gl_account_id: string;
    description: string;
    debit_amount?: number;
    credit_amount?: number;
    reference_data?: any;
    notes?: string;
}
export declare class CreateJournalEntryDto {
    entry_date: string;
    description: string;
    source_type?: string;
    source_id?: string;
    lines: CreateJournalEntryLineDto[];
    notes?: string;
}
