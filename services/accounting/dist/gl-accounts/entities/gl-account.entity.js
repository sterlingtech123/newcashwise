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
exports.GLAccount = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
let GLAccount = class GLAccount extends base_entity_1.BaseEntity {
    isAsset() {
        return this.account_type === 'asset';
    }
    isLiability() {
        return this.account_type === 'liability';
    }
    isEquity() {
        return this.account_type === 'equity';
    }
    isRevenue() {
        return this.account_type === 'revenue';
    }
    isExpense() {
        return this.account_type === 'expense';
    }
    hasNormalDebitBalance() {
        return this.normal_balance === 'debit';
    }
    calculateBalance() {
        if (this.hasNormalDebitBalance()) {
            return Number(this.debit_balance) - Number(this.credit_balance);
        }
        else {
            return Number(this.credit_balance) - Number(this.debit_balance);
        }
    }
};
exports.GLAccount = GLAccount;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], GLAccount.prototype, "account_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GLAccount.prototype, "account_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GLAccount.prototype, "account_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GLAccount.prototype, "account_subtype", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], GLAccount.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], GLAccount.prototype, "parent_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GLAccount.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], GLAccount.prototype, "is_system", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GLAccount.prototype, "opening_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GLAccount.prototype, "current_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GLAccount.prototype, "debit_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GLAccount.prototype, "credit_balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'debit' }),
    __metadata("design:type", String)
], GLAccount.prototype, "normal_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], GLAccount.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], GLAccount.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GLAccount, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_account_id' }),
    __metadata("design:type", GLAccount)
], GLAccount.prototype, "parent_account", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GLAccount, account => account.parent_account),
    __metadata("design:type", Array)
], GLAccount.prototype, "child_accounts", void 0);
exports.GLAccount = GLAccount = __decorate([
    (0, typeorm_1.Entity)('gl_accounts', { schema: 'accounting' }),
    (0, typeorm_1.Index)(['tenant_id', 'account_code']),
    (0, typeorm_1.Index)(['tenant_id', 'account_type']),
    (0, typeorm_1.Index)(['tenant_id', 'is_active'])
], GLAccount);
//# sourceMappingURL=gl-account.entity.js.map