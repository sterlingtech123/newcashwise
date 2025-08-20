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
exports.GLAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gl_accounts_service_1 = require("./gl-accounts.service");
const create_gl_account_dto_1 = require("./dto/create-gl-account.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let GLAccountsController = class GLAccountsController {
    constructor(glAccountsService) {
        this.glAccountsService = glAccountsService;
    }
    async create(createGLAccountDto) {
        return this.glAccountsService.create(createGLAccountDto);
    }
    async initializeDefault() {
        return this.glAccountsService.initializeDefaultChart();
    }
    async findAll(account_type, is_active, parent_id) {
        const filters = { account_type, is_active, parent_id };
        return this.glAccountsService.findAll(filters);
    }
    async getChartOfAccounts() {
        return this.glAccountsService.getChartOfAccounts();
    }
    async findOne(id) {
        return this.glAccountsService.findOne(id);
    }
    async getBalance(id, as_of_date) {
        const asOfDate = as_of_date ? new Date(as_of_date) : undefined;
        return this.glAccountsService.getAccountBalance(id, asOfDate);
    }
    async update(id, updateData) {
        return this.glAccountsService.update(id, updateData);
    }
    async deactivate(id) {
        return this.glAccountsService.deactivate(id);
    }
};
exports.GLAccountsController = GLAccountsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new GL account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'GL account created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid account data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gl_account_dto_1.CreateGLAccountDto]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('initialize-default'),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize default chart of accounts' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Default chart of accounts created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Chart of accounts already exists' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "initializeDefault", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all GL accounts' }),
    (0, swagger_1.ApiQuery)({ name: 'account_type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'is_active', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'parent_id', required: false, type: String }),
    __param(0, (0, common_1.Query)('account_type')),
    __param(1, (0, common_1.Query)('is_active', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('parent_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chart of accounts (hierarchical view)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chart of accounts retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "getChartOfAccounts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a GL account by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GL account found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'GL account not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get account balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Account balance retrieved' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('as_of_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a GL account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GL account updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'GL account not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a GL account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GL account deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate this account' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GLAccountsController.prototype, "deactivate", null);
exports.GLAccountsController = GLAccountsController = __decorate([
    (0, swagger_1.ApiTags)('GL Accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('gl-accounts'),
    __metadata("design:paramtypes", [gl_accounts_service_1.GLAccountsService])
], GLAccountsController);
//# sourceMappingURL=gl-accounts.controller.js.map