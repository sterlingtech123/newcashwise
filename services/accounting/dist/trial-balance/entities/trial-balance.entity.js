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
exports.TrialBalanceSnapshot = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
let TrialBalanceSnapshot = class TrialBalanceSnapshot extends base_entity_1.BaseEntity {
};
exports.TrialBalanceSnapshot = TrialBalanceSnapshot;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TrialBalanceSnapshot.prototype, "period_end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], TrialBalanceSnapshot.prototype, "gl_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrialBalanceSnapshot.prototype, "account_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrialBalanceSnapshot.prototype, "account_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrialBalanceSnapshot.prototype, "account_type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], TrialBalanceSnapshot.prototype, "opening_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], TrialBalanceSnapshot.prototype, "period_debits", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], TrialBalanceSnapshot.prototype, "period_credits", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], TrialBalanceSnapshot.prototype, "closing_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], TrialBalanceSnapshot.prototype, "metadata", void 0);
exports.TrialBalanceSnapshot = TrialBalanceSnapshot = __decorate([
    (0, typeorm_1.Entity)('trial_balance_snapshots', { schema: 'accounting' }),
    (0, typeorm_1.Index)(['tenant_id', 'period_end_date'])
], TrialBalanceSnapshot);
//# sourceMappingURL=trial-balance.entity.js.map