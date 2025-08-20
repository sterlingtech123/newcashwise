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
exports.CreateBankAccountDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBankAccountDto {
}
exports.CreateBankAccountDto = CreateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "account_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank account number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "account_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bank_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bank_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Branch name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "branch_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Branch code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "branch_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code', default: 'NGN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account type',
        enum: ['checking', 'savings', 'money_market', 'term_deposit']
    }),
    (0, class_validator_1.IsIn)(['checking', 'savings', 'money_market', 'term_deposit']),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "account_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current account balance', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "current_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum balance requirement', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "minimum_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overdraft limit', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "overdraft_limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is account active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is primary operating account', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "is_main_account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank API connection configuration', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBankAccountDto.prototype, "bank_connection_config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBankAccountDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-bank-account.dto.js.map