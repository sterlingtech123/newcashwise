export declare class CreateBankAccountDto {
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    branch_name: string;
    branch_code: string;
    currency?: string;
    account_type: string;
    current_balance?: number;
    minimum_balance?: number;
    overdraft_limit?: number;
    is_active?: boolean;
    is_main_account?: boolean;
    bank_connection_config?: any;
    description?: string;
    metadata?: any;
}
