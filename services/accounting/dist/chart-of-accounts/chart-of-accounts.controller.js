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
exports.ChartOfAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chart_of_accounts_service_1 = require("./chart-of-accounts.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let ChartOfAccountsController = class ChartOfAccountsController {
    constructor(chartOfAccountsService) {
        this.chartOfAccountsService = chartOfAccountsService;
    }
    async getHierarchy() {
        return this.chartOfAccountsService.getHierarchicalChart();
    }
    async getByType(type) {
        return this.chartOfAccountsService.getAccountsByType(type);
    }
    async getBalanceSheet() {
        return this.chartOfAccountsService.getBalanceSheet();
    }
    async getIncomeStatement() {
        return this.chartOfAccountsService.getIncomeStatement();
    }
    async searchAccounts(query) {
        return this.chartOfAccountsService.searchAccounts(query);
    }
    async validateStructure() {
        return this.chartOfAccountsService.validateChartStructure();
    }
};
exports.ChartOfAccountsController = ChartOfAccountsController;
__decorate([
    (0, common_1.Get)('hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hierarchical chart of accounts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hierarchical chart retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "getHierarchy", null);
__decorate([
    (0, common_1.Get)('by-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get accounts by type' }),
    (0, swagger_1.ApiQuery)({ name: 'type', type: String, enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Accounts by type retrieved' }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)('balance-sheet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get balance sheet structure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance sheet structure retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "getBalanceSheet", null);
__decorate([
    (0, common_1.Get)('income-statement'),
    (0, swagger_1.ApiOperation)({ summary: 'Get income statement structure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Income statement structure retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "getIncomeStatement", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search accounts' }),
    (0, swagger_1.ApiQuery)({ name: 'q', type: String, description: 'Search query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "searchAccounts", null);
__decorate([
    (0, common_1.Get)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate chart of accounts structure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation results' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "validateStructure", null);
exports.ChartOfAccountsController = ChartOfAccountsController = __decorate([
    (0, swagger_1.ApiTags)('Chart of Accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('chart-of-accounts'),
    __metadata("design:paramtypes", [chart_of_accounts_service_1.ChartOfAccountsService])
], ChartOfAccountsController);
//# sourceMappingURL=chart-of-accounts.controller.js.map