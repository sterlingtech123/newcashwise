import { BaseEntity } from '../../common/entities/base.entity';
export declare class TrialBalanceSnapshot extends BaseEntity {
    period_end_date: Date;
    gl_account_id: string;
    account_code: string;
    account_name: string;
    account_type: string;
    opening_balance: number;
    period_debits: number;
    period_credits: number;
    closing_balance: number;
    metadata: any;
}
