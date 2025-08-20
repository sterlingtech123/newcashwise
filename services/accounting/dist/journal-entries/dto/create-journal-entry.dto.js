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
exports.CreateJournalEntryDto = exports.CreateJournalEntryLineDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateJournalEntryLineDto {
}
exports.CreateJournalEntryLineDto = CreateJournalEntryLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'GL Account ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "gl_account_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Line description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debit amount', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "debit_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Credit amount', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "credit_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional reference data', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateJournalEntryLineDto.prototype, "reference_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Line notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "notes", void 0);
class CreateJournalEntryDto {
}
exports.CreateJournalEntryDto = CreateJournalEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entry date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "entry_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entry description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source type', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "source_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "source_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journal entry lines', type: [CreateJournalEntryLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateJournalEntryLineDto),
    __metadata("design:type", Array)
], CreateJournalEntryDto.prototype, "lines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entry notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "notes", void 0);
//# sourceMappingURL=create-journal-entry.dto.js.map