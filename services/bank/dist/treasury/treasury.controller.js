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
exports.TreasuryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const treasury_service_1 = require("./treasury.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let TreasuryController = class TreasuryController {
    constructor(treasuryService) {
        this.treasuryService = treasuryService;
    }
    async getCashPosition() {
        return this.treasuryService.getCashPosition();
    }
    async getCashForecast(days) {
        return this.treasuryService.getCashForecast(days);
    }
    async getLiquidityAnalysis() {
        return this.treasuryService.getLiquidityAnalysis();
    }
};
exports.TreasuryController = TreasuryController;
__decorate([
    (0, common_1.Get)('cash-position'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current cash position' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cash position retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getCashPosition", null);
__decorate([
    (0, common_1.Get)('cash-forecast'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cash flow forecast' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Forecast period in days' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cash forecast generated' }),
    __param(0, (0, common_1.Query)('days', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getCashForecast", null);
__decorate([
    (0, common_1.Get)('liquidity-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get liquidity analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liquidity analysis generated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getLiquidityAnalysis", null);
exports.TreasuryController = TreasuryController = __decorate([
    (0, swagger_1.ApiTags)('Treasury'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('treasury'),
    __metadata("design:paramtypes", [treasury_service_1.TreasuryService])
], TreasuryController);
//# sourceMappingURL=treasury.controller.js.map