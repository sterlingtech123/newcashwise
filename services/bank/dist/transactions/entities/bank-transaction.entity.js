"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankTransaction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const bank_account_entity_1 = require("../../bank-accounts/entities/bank-account.entity");
let BankTransaction = class BankTransaction extends base_entity_1.BaseEntity {
    isCredit() {
        return this.transaction_type === 'credit';
    }
    isDebit() {
        return this.transaction_type === 'debit';
    }
    isReconciled() {
        return this.reconciliation_status === 'reconciled';
    }
    getSignedAmount() {
        const amount = Number(this.amount);
        return this.isCredit() ? amount : -amount;
    }
};
exports.BankTransaction = BankTransaction;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BankTransaction.prototype, "bank_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], BankTransaction.prototype, "transaction_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "value_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankTransaction.prototype, "transaction_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankTransaction.prototype, "transaction_category", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], BankTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BankTransaction.prototype, "running_balance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "reference_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "bank_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "beneficiary_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "beneficiary_account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "originator_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "originator_account", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'posted' }),
    __metadata("design:type", String)
], BankTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'unreconciled' }),
    __metadata("design:type", String)
], BankTransaction.prototype, "reconciliation_status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "payment_voucher_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "gl_journal_entry_id", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "reconciled_at", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "reconciled_by", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], BankTransaction.prototype, "bank_data", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount, account => account.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], BankTransaction.prototype, "bank_account", void 0);
exports.BankTransaction = BankTransaction = __decorate([
    (0, typeorm_1.Entity)('bank_transactions', { schema: 'bank' }),
    (0, typeorm_1.Index)(['tenant_id', 'bank_account_id']),
    (0, typeorm_1.Index)(['tenant_id', 'transaction_date']),
    (0, typeorm_1.Index)(['tenant_id', 'reference_number']),
    (0, typeorm_1.Index)(['tenant_id', 'status'])
], BankTransaction);
//# sourceMappingURL=bank-transaction.entity.js.map