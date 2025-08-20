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
exports.Reconciliation = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const bank_account_entity_1 = require("../../bank-accounts/entities/bank-account.entity");
const reconciliation_item_entity_1 = require("./reconciliation-item.entity");
let Reconciliation = class Reconciliation extends base_entity_1.BaseEntity {
    isBalanced() {
        return Math.abs(Number(this.variance)) < 0.01;
    }
    getCompletionPercentage() {
        const totalItems = this.matched_items_count + this.unmatched_items_count;
        if (totalItems === 0)
            return 100;
        return (this.matched_items_count / totalItems) * 100;
    }
    calculateVariance() {
        const bookBalance = Number(this.closing_balance);
        const statementBalance = Number(this.statement_closing_balance);
        const outstandingCredits = Number(this.outstanding_credits);
        const outstandingDebits = Number(this.outstanding_debits);
        const adjustedBookBalance = bookBalance + outstandingCredits - outstandingDebits;
        return adjustedBookBalance - statementBalance;
    }
};
exports.Reconciliation = Reconciliation;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Reconciliation.prototype, "bank_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "reconciliation_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "period_start_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "period_end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "opening_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "closing_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "statement_opening_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "statement_closing_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "variance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Reconciliation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reconciliation.prototype, "statement_reference", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Reconciliation.prototype, "statement_date", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "matched_items_count", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "unmatched_items_count", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "outstanding_credits", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reconciliation.prototype, "outstanding_debits", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Reconciliation.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Reconciliation.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Reconciliation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Reconciliation.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], Reconciliation.prototype, "bank_account", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reconciliation_item_entity_1.ReconciliationItem, item => item.reconciliation, { cascade: true }),
    __metadata("design:type", Array)
], Reconciliation.prototype, "items", void 0);
exports.Reconciliation = Reconciliation = __decorate([
    (0, typeorm_1.Entity)('reconciliations', { schema: 'bank' }),
    (0, typeorm_1.Index)(['tenant_id', 'bank_account_id']),
    (0, typeorm_1.Index)(['tenant_id', 'reconciliation_date']),
    (0, typeorm_1.Index)(['tenant_id', 'status'])
], Reconciliation);
//# sourceMappingURL=reconciliation.entity.js.map