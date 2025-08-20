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
exports.ReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reconciliation_service_1 = require("./reconciliation.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let ReconciliationController = class ReconciliationController {
    constructor(reconciliationService) {
        this.reconciliationService = reconciliationService;
    }
    async startReconciliation(body) {
        return this.reconciliationService.startReconciliation(body);
    }
    async addStatementItems(id, body) {
        return this.reconciliationService.addStatementItems(id, body.items);
    }
    async performAutoMatching(id) {
        return this.reconciliationService.performAutoMatching(id);
    }
    async matchItems(itemId, body) {
        return this.reconciliationService.matchItems(itemId, body.statement_item_id, body.reason);
    }
    async unmatchItems(itemId) {
        return this.reconciliationService.unmatchItems(itemId);
    }
    async completeReconciliation(id) {
        return this.reconciliationService.completeReconciliation(id);
    }
    async findAll(bank_account_id, status, date_from, date_to) {
        const filters = { bank_account_id, status, date_from, date_to };
        return this.reconciliationService.findAll(filters);
    }
    async findOne(id) {
        return this.reconciliationService.findOne(id);
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new bank reconciliation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reconciliation started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid reconciliation data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "startReconciliation", null);
__decorate([
    (0, common_1.Post)(':id/statement-items'),
    (0, swagger_1.ApiOperation)({ summary: 'Add statement items to reconciliation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statement items added successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "addStatementItems", null);
__decorate([
    (0, common_1.Post)(':id/auto-match'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform automatic matching of transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-matching completed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "performAutoMatching", null);
__decorate([
    (0, common_1.Post)('items/:itemId/match'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually match reconciliation items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items matched successfully' }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "matchItems", null);
__decorate([
    (0, common_1.Post)('items/:itemId/unmatch'),
    (0, swagger_1.ApiOperation)({ summary: 'Unmatch reconciliation items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items unmatched successfully' }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "unmatchItems", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete bank reconciliation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reconciliation completed successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "completeReconciliation", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bank reconciliations' }),
    (0, swagger_1.ApiQuery)({ name: 'bank_account_id', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_to', required: false, type: String }),
    __param(0, (0, common_1.Query)('bank_account_id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('date_from')),
    __param(3, (0, common_1.Query)('date_to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a reconciliation by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reconciliation found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reconciliation not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "findOne", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, swagger_1.ApiTags)('Reconciliation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('reconciliation'),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map