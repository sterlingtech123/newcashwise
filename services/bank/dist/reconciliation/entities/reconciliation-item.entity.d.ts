import { BaseEntity } from '../../common/entities/base.entity';
import { Reconciliation } from './reconciliation.entity';
import { BankTransaction } from '../../transactions/entities/bank-transaction.entity';
export declare class ReconciliationItem extends BaseEntity {
    reconciliation_id: string;
    bank_transaction_id: string;
    item_type: string;
    transaction_date: Date;
    description: string;
    amount: number;
    transaction_type: string;
    reference_number: string;
    statement_reference: string;
    status: string;
    matched_with_id: string;
    matched_at: Date;
    matched_by: string;
    match_reason: string;
    notes: string;
    statement_data: any;
    reconciliation: Reconciliation;
    bank_transaction: BankTransaction;
    isMatched(): boolean;
    isCredit(): boolean;
    isDebit(): boolean;
    getSignedAmount(): number;
}
