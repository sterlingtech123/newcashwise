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
exports.CreateGLAccountDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateGLAccountDto {
}
exports.CreateGLAccountDto = CreateGLAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account code (must be unique)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "account_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "account_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account type',
        enum: ['asset', 'liability', 'equity', 'revenue', 'expense']
    }),
    (0, class_validator_1.IsIn)(['asset', 'liability', 'equity', 'revenue', 'expense']),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "account_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account subtype' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "account_subtype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Parent account ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "parent_account_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is account active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGLAccountDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opening balance', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateGLAccountDto.prototype, "opening_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Normal balance type',
        enum: ['debit', 'credit'],
        default: 'debit'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['debit', 'credit']),
    __metadata("design:type", String)
], CreateGLAccountDto.prototype, "normal_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account tags', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateGLAccountDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateGLAccountDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-gl-account.dto.js.map