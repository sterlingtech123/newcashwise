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
exports.ReconciliationItem = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const reconciliation_entity_1 = require("./reconciliation.entity");
const bank_transaction_entity_1 = require("../../transactions/entities/bank-transaction.entity");
let ReconciliationItem = class ReconciliationItem extends base_entity_1.BaseEntity {
    isMatched() {
        return this.status === 'matched';
    }
    isCredit() {
        return this.transaction_type === 'credit';
    }
    isDebit() {
        return this.transaction_type === 'debit';
    }
    getSignedAmount() {
        const amount = Number(this.amount);
        return this.isCredit() ? amount : -amount;
    }
};
exports.ReconciliationItem = ReconciliationItem;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "reconciliation_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "bank_transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "item_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ReconciliationItem.prototype, "transaction_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], ReconciliationItem.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "transaction_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "reference_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "statement_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'unmatched' }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "matched_with_id", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], ReconciliationItem.prototype, "matched_at", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "matched_by", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "match_reason", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ReconciliationItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], ReconciliationItem.prototype, "statement_data", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reconciliation_entity_1.Reconciliation, reconciliation => reconciliation.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reconciliation_id' }),
    __metadata("design:type", reconciliation_entity_1.Reconciliation)
], ReconciliationItem.prototype, "reconciliation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_transaction_entity_1.BankTransaction, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'bank_transaction_id' }),
    __metadata("design:type", bank_transaction_entity_1.BankTransaction)
], ReconciliationItem.prototype, "bank_transaction", void 0);
exports.ReconciliationItem = ReconciliationItem = __decorate([
    (0, typeorm_1.Entity)('reconciliation_items', { schema: 'bank' }),
    (0, typeorm_1.Index)(['tenant_id', 'reconciliation_id']),
    (0, typeorm_1.Index)(['tenant_id', 'item_type']),
    (0, typeorm_1.Index)(['tenant_id', 'status'])
], ReconciliationItem);
//# sourceMappingURL=reconciliation-item.entity.js.map