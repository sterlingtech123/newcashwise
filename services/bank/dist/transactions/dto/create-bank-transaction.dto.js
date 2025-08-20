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
exports.CreateBankTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBankTransactionDto {
}
exports.CreateBankTransactionDto = CreateBankTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank account ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "bank_account_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "transaction_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "value_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction type',
        enum: ['credit', 'debit']
    }),
    (0, class_validator_1.IsIn)(['credit', 'debit']),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "transaction_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction category' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "transaction_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateBankTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Running balance after transaction', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateBankTransactionDto.prototype, "running_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Internal reference number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "reference_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank reference number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "bank_reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Beneficiary name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "beneficiary_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Beneficiary account', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "beneficiary_account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Originator name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "originator_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Originator account', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "originator_account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction status',
        enum: ['pending', 'posted', 'failed', 'reversed'],
        default: 'posted'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['pending', 'posted', 'failed', 'reversed']),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment voucher ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "payment_voucher_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'GL journal entry ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "gl_journal_entry_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Raw bank data', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBankTransactionDto.prototype, "bank_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "notes", void 0);
//# sourceMappingURL=create-bank-transaction.dto.js.map