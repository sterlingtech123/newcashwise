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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("./transactions.service");
const create_bank_transaction_dto_1 = require("./dto/create-bank-transaction.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async create(createTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }
    async findAll(page, limit, bank_account_id, transaction_type, status, reconciliation_status, date_from, date_to, category) {
        const filters = {
            bank_account_id,
            transaction_type,
            status,
            reconciliation_status,
            date_from,
            date_to,
            category
        };
        return this.transactionsService.findAll(page, limit, filters);
    }
    async findOne(id) {
        return this.transactionsService.findOne(id);
    }
    async reverseTransaction(id, body) {
        return this.transactionsService.reverseTransaction(id, body.reason);
    }
    async getAccountStatement(accountId, startDate, endDate) {
        return this.transactionsService.getAccountStatement(accountId, new Date(startDate), new Date(endDate));
    }
    async updateReconciliationStatus(id, body) {
        return this.transactionsService.updateReconciliationStatus(id, body.status, body.reconciled_by);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new bank transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid transaction data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bank_transaction_dto_1.CreateBankTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bank transactions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'bank_account_id', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'transaction_type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'reconciliation_status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('bank_account_id')),
    __param(3, (0, common_1.Query)('transaction_type')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('reconciliation_status')),
    __param(6, (0, common_1.Query)('date_from')),
    __param(7, (0, common_1.Query)('date_to')),
    __param(8, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a transaction by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/reverse'),
    (0, swagger_1.ApiOperation)({ summary: 'Reverse a bank transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction reversed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot reverse this transaction' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "reverseTransaction", null);
__decorate([
    (0, common_1.Get)('account/:accountId/statement'),
    (0, swagger_1.ApiOperation)({ summary: 'Get account statement for a period' }),
    (0, swagger_1.ApiQuery)({ name: 'start_date', type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'end_date', type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Account statement generated' }),
    __param(0, (0, common_1.Param)('accountId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAccountStatement", null);
__decorate([
    (0, common_1.Post)(':id/reconcile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transaction reconciliation status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reconciliation status updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateReconciliationStatus", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map