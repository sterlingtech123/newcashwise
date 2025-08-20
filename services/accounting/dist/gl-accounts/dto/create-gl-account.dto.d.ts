export declare class CreateGLAccountDto {
    account_code: string;
    account_name: string;
    account_type: string;
    account_subtype: string;
    description?: string;
    parent_account_id?: string;
    is_active?: boolean;
    opening_balance?: number;
    normal_balance?: string;
    tags?: string[];
    metadata?: any;
}
