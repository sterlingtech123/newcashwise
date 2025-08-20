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
exports.TrialBalanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trial_balance_service_1 = require("./trial-balance.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let TrialBalanceController = class TrialBalanceController {
    constructor(trialBalanceService) {
        this.trialBalanceService = trialBalanceService;
    }
    async generateTrialBalance(periodStart, periodEnd, accountTypes) {
        return this.trialBalanceService.generateTrialBalance(new Date(periodStart), new Date(periodEnd), accountTypes);
    }
    async generateFinancialStatements(periodStart, periodEnd) {
        return this.trialBalanceService.generateFinancialStatements(new Date(periodStart), new Date(periodEnd));
    }
    async saveSnapshot(body) {
        await this.trialBalanceService.saveTrialBalanceSnapshot(new Date(body.period_end_date), body.entries);
    }
    async getHistory(startDate, endDate) {
        return this.trialBalanceService.getTrialBalanceHistory(new Date(startDate), new Date(endDate));
    }
    async validateTrialBalance(body) {
        return this.trialBalanceService.validateTrialBalance(body.entries);
    }
};
exports.TrialBalanceController = TrialBalanceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate trial balance for a period' }),
    (0, swagger_1.ApiQuery)({ name: 'period_start', type: String, description: 'Period start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'period_end', type: String, description: 'Period end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'account_types', required: false, type: [String], description: 'Filter by account types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trial balance generated successfully' }),
    __param(0, (0, common_1.Query)('period_start')),
    __param(1, (0, common_1.Query)('period_end')),
    __param(2, (0, common_1.Query)('account_types', new common_1.ParseArrayPipe({ items: String, separator: ',', optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], TrialBalanceController.prototype, "generateTrialBalance", null);
__decorate([
    (0, common_1.Get)('financial-statements'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate financial statements for a period' }),
    (0, swagger_1.ApiQuery)({ name: 'period_start', type: String, description: 'Period start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'period_end', type: String, description: 'Period end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial statements generated successfully' }),
    __param(0, (0, common_1.Query)('period_start')),
    __param(1, (0, common_1.Query)('period_end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TrialBalanceController.prototype, "generateFinancialStatements", null);
__decorate([
    (0, common_1.Post)('snapshot'),
    (0, swagger_1.ApiOperation)({ summary: 'Save trial balance snapshot' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trial balance snapshot saved' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrialBalanceController.prototype, "saveSnapshot", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trial balance history' }),
    (0, swagger_1.ApiQuery)({ name: 'start_date', type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'end_date', type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trial balance history retrieved' }),
    __param(0, (0, common_1.Query)('start_date')),
    __param(1, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TrialBalanceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate trial balance entries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trial balance validation result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrialBalanceController.prototype, "validateTrialBalance", null);
exports.TrialBalanceController = TrialBalanceController = __decorate([
    (0, swagger_1.ApiTags)('Trial Balance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('trial-balance'),
    __metadata("design:paramtypes", [trial_balance_service_1.TrialBalanceService])
], TrialBalanceController);
//# sourceMappingURL=trial-balance.controller.js.map