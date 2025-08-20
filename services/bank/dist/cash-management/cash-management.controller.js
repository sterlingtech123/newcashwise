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
exports.CashManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cash_management_service_1 = require("./cash-management.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let CashManagementController = class CashManagementController {
    constructor(cashManagementService) {
        this.cashManagementService = cashManagementService;
    }
    async optimizeCashAllocation() {
        return this.cashManagementService.optimizeCashAllocation();
    }
    async getInvestmentOpportunities() {
        return this.cashManagementService.getInvestmentOpportunities();
    }
};
exports.CashManagementController = CashManagementController;
__decorate([
    (0, common_1.Get)('optimize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CashManagementController.prototype, "optimizeCashAllocation", null);
__decorate([
    (0, common_1.Get)('investments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CashManagementController.prototype, "getInvestmentOpportunities", null);
exports.CashManagementController = CashManagementController = __decorate([
    (0, swagger_1.ApiTags)('Cash Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('cash-management'),
    __metadata("design:paramtypes", [cash_management_service_1.CashManagementService])
], CashManagementController);
//# sourceMappingURL=cash-management.controller.js.map