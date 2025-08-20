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
exports.BankAccount = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const bank_transaction_entity_1 = require("../../transactions/entities/bank-transaction.entity");
let BankAccount = class BankAccount extends base_entity_1.BaseEntity {
    getAvailableBalance() {
        return Number(this.available_balance) || Number(this.current_balance);
    }
    canDebit(amount) {
        const availableBalance = this.getAvailableBalance();
        const overdraftLimit = Number(this.overdraft_limit) || 0;
        return (availableBalance + overdraftLimit) >= amount;
    }
    isOverdrawn() {
        return Number(this.current_balance) < 0;
    }
    getEffectiveBalance() {
        const balance = Number(this.current_balance);
        const overdraftLimit = Number(this.overdraft_limit) || 0;
        return balance + overdraftLimit;
    }
};
exports.BankAccount = BankAccount;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "account_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "account_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "bank_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "bank_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "branch_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "branch_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'NGN' }),
    __metadata("design:type", String)
], BankAccount.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankAccount.prototype, "account_type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BankAccount.prototype, "current_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BankAccount.prototype, "available_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BankAccount.prototype, "ledger_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BankAccount.prototype, "minimum_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BankAccount.prototype, "overdraft_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "is_main_account", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { nullable: true }),
    __metadata("design:type", Date)
], BankAccount.prototype, "last_reconciled_date", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], BankAccount.prototype, "last_statement_date", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], BankAccount.prototype, "bank_connection_config", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], BankAccount.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bank_transaction_entity_1.BankTransaction, transaction => transaction.bank_account),
    __metadata("design:type", Array)
], BankAccount.prototype, "transactions", void 0);
exports.BankAccount = BankAccount = __decorate([
    (0, typeorm_1.Entity)('bank_accounts', { schema: 'bank' }),
    (0, typeorm_1.Index)(['tenant_id', 'account_number']),
    (0, typeorm_1.Index)(['tenant_id', 'is_active'])
], BankAccount);
//# sourceMappingURL=bank-account.entity.js.map