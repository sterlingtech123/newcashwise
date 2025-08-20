export declare class CreateBankTransactionDto {
    bank_account_id: string;
    transaction_date: string;
    value_date?: string;
    transaction_type: string;
    transaction_category: string;
    amount: number;
    running_balance?: number;
    description: string;
    reference_number?: string;
    bank_reference?: string;
    beneficiary_name?: string;
    beneficiary_account?: string;
    originator_name?: string;
    originator_account?: string;
    status?: string;
    payment_voucher_id?: string;
    gl_journal_entry_id?: string;
    bank_data?: any;
    notes?: string;
}
