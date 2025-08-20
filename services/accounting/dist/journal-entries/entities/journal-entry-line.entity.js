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
exports.JournalEntryLine = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
const gl_account_entity_1 = require("../../gl-accounts/entities/gl-account.entity");
let JournalEntryLine = class JournalEntryLine extends base_entity_1.BaseEntity {
    getAmount() {
        return Number(this.debit_amount) || Number(this.credit_amount);
    }
    isDebit() {
        return Number(this.debit_amount) > 0;
    }
};
exports.JournalEntryLine = JournalEntryLine;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "journal_entry_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "gl_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], JournalEntryLine.prototype, "line_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "debit_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "credit_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], JournalEntryLine.prototype, "reference_data", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry, entry => entry.lines, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'journal_entry_id' }),
    __metadata("design:type", journal_entry_entity_1.JournalEntry)
], JournalEntryLine.prototype, "journal_entry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gl_account_entity_1.GLAccount),
    (0, typeorm_1.JoinColumn)({ name: 'gl_account_id' }),
    __metadata("design:type", gl_account_entity_1.GLAccount)
], JournalEntryLine.prototype, "gl_account", void 0);
exports.JournalEntryLine = JournalEntryLine = __decorate([
    (0, typeorm_1.Entity)('journal_entry_lines', { schema: 'accounting' }),
    (0, typeorm_1.Index)(['tenant_id', 'journal_entry_id']),
    (0, typeorm_1.Index)(['tenant_id', 'gl_account_id']),
    (0, typeorm_1.Index)(['tenant_id', 'line_date'])
], JournalEntryLine);
//# sourceMappingURL=journal-entry-line.entity.js.map