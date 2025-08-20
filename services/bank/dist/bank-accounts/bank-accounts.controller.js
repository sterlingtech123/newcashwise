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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bank_accounts_service_1 = require("./bank-accounts.service");
const create_bank_account_dto_1 = require("./dto/create-bank-account.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let BankAccountsController = class BankAccountsController {
    constructor(bankAccountsService) {
        this.bankAccountsService = bankAccountsService;
    }
    async create(createBankAccountDto) {
        return this.bankAccountsService.create(createBankAccountDto);
    }
    async findAll(is_active, account_type) {
        const filters = { is_active, account_type };
        return this.bankAccountsService.findAll(filters);
    }
    async getMainAccount() {
        return this.bankAccountsService.getMainAccount();
    }
    async getTotalBalance() {
        return this.bankAccountsService.getTotalBalance();
    }
    async findOne(id) {
        return this.bankAccountsService.findOne(id);
    }
    async findByAccountNumber(accountNumber) {
        return this.bankAccountsService.findByAccountNumber(accountNumber);
    }
    async update(id, updateData) {
        return this.bankAccountsService.update(id, updateData);
    }
    async updateBalance(id, body) {
        return this.bankAccountsService.updateBalance(id, body.balance, body.balance_type || 'current');
    }
    async deactivate(id) {
        return this.bankAccountsService.deactivate(id);
    }
    async validateTransaction(id, body) {
        return this.bankAccountsService.validateAccountForTransaction(id, body.amount, body.transaction_type);
    }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new bank account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bank account created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid account data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bank_account_dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bank accounts' }),
    (0, swagger_1.ApiQuery)({ name: 'is_active', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'account_type', required: false, type: String }),
    __param(0, (0, common_1.Query)('is_active', new common_1.ParseBoolPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('account_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('main'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the main bank account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Main bank account retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No main account found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "getMainAccount", null);
__decorate([
    (0, common_1.Get)('total-balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total balance across all accounts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total balance calculated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "getTotalBalance", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a bank account by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank account not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('account-number/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a bank account by account number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank account not found' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findByAccountNumber", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a bank account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank account not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bank account balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "updateBalance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a bank account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate this account' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/validate-transaction'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate if an account can handle a transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "validateTransaction", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, swagger_1.ApiTags)('Bank Accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('bank-accounts'),
    __metadata("design:paramtypes", [bank_accounts_service_1.BankAccountsService])
], BankAccountsController);
//# sourceMappingURL=bank-accounts.controller.js.map