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
exports.JournalEntry = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const journal_entry_line_entity_1 = require("./journal-entry-line.entity");
let JournalEntry = class JournalEntry extends base_entity_1.BaseEntity {
    validateBalance() {
        return Math.abs(Number(this.total_debit) - Number(this.total_credit)) < 0.01;
    }
};
exports.JournalEntry = JournalEntry;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], JournalEntry.prototype, "entry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "reference_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JournalEntry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'manual' }),
    __metadata("design:type", String)
], JournalEntry.prototype, "source_type", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "source_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], JournalEntry.prototype, "total_debit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], JournalEntry.prototype, "total_credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], JournalEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "posted_by", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], JournalEntry.prototype, "posted_at", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "reversed_by", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], JournalEntry.prototype, "reversed_at", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "reversal_reason", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_entry_line_entity_1.JournalEntryLine, line => line.journal_entry, { cascade: true }),
    __metadata("design:type", Array)
], JournalEntry.prototype, "lines", void 0);
exports.JournalEntry = JournalEntry = __decorate([
    (0, typeorm_1.Entity)('journal_entries', { schema: 'accounting' }),
    (0, typeorm_1.Index)(['tenant_id', 'entry_date']),
    (0, typeorm_1.Index)(['tenant_id', 'reference_number']),
    (0, typeorm_1.Index)(['tenant_id', 'source_type', 'source_id'])
], JournalEntry);
//# sourceMappingURL=journal-entry.entity.js.map