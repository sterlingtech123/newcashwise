import { BaseEntity } from '../../common/entities/base.entity';
export declare class GLAccount extends BaseEntity {
    account_code: string;
    account_name: string;
    account_type: string;
    account_subtype: string;
    description: string;
    parent_account_id: string;
    is_active: boolean;
    is_system: boolean;
    opening_balance: number;
    current_balance: number;
    debit_balance: number;
    credit_balance: number;
    normal_balance: string;
    tags: string[];
    metadata: any;
    parent_account: GLAccount;
    child_accounts: GLAccount[];
    isAsset(): boolean;
    isLiability(): boolean;
    isEquity(): boolean;
    isRevenue(): boolean;
    isExpense(): boolean;
    hasNormalDebitBalance(): boolean;
    calculateBalance(): number;
}
