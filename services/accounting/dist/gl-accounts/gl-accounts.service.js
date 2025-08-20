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
exports.GLAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gl_account_entity_1 = require("./entities/gl-account.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let GLAccountsService = class GLAccountsService {
    constructor(glAccountRepository, tenantService, auditService) {
        this.glAccountRepository = glAccountRepository;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createGLAccountDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const existingAccount = await this.glAccountRepository.findOne({
            where: {
                account_code: createGLAccountDto.account_code,
                tenant_id: tenantId,
            },
        });
        if (existingAccount) {
            throw new common_1.BadRequestException(`Account code ${createGLAccountDto.account_code} already exists`);
        }
        if (createGLAccountDto.parent_account_id) {
            const parentAccount = await this.glAccountRepository.findOne({
                where: {
                    id: createGLAccountDto.parent_account_id,
                    tenant_id: tenantId,
                },
            });
            if (!parentAccount) {
                throw new common_1.BadRequestException('Parent account not found');
            }
        }
        const normalBalance = createGLAccountDto.normal_balance ||
            this.getDefaultNormalBalance(createGLAccountDto.account_type);
        const glAccount = this.glAccountRepository.create({
            ...createGLAccountDto,
            tenant_id: tenantId,
            normal_balance: normalBalance,
            current_balance: createGLAccountDto.opening_balance || 0,
            debit_balance: 0,
            credit_balance: 0,
            created_by: userId,
        });
        const savedAccount = await this.glAccountRepository.save(glAccount);
        await this.auditService.logAction(tenantId, userId, 'CREATE', 'GLAccount', savedAccount.id, null, savedAccount);
        return savedAccount;
    }
    async findAll(filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.glAccountRepository
            .createQueryBuilder('account')
            .leftJoinAndSelect('account.parent_account', 'parent')
            .leftJoinAndSelect('account.child_accounts', 'children')
            .where('account.tenant_id = :tenantId', { tenantId })
            .orderBy('account.account_code', 'ASC');
        if (filters?.account_type) {
            queryBuilder.andWhere('account.account_type = :account_type', {
                account_type: filters.account_type,
            });
        }
        if (filters?.is_active !== undefined) {
            queryBuilder.andWhere('account.is_active = :is_active', {
                is_active: filters.is_active,
            });
        }
        if (filters?.parent_id) {
            queryBuilder.andWhere('account.parent_account_id = :parent_id', {
                parent_id: filters.parent_id,
            });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.glAccountRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['parent_account', 'child_accounts'],
        });
        if (!account) {
            throw new common_1.NotFoundException(`GL Account with ID ${id} not found`);
        }
        return account;
    }
    async update(id, updateData) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const account = await this.findOne(id);
        if (updateData.account_code && updateData.account_code !== account.account_code) {
            const existingAccount = await this.glAccountRepository.findOne({
                where: {
                    account_code: updateData.account_code,
                    tenant_id: tenantId,
                },
            });
            if (existingAccount) {
                throw new common_1.BadRequestException(`Account code ${updateData.account_code} already exists`);
            }
        }
        if (updateData.parent_account_id && updateData.parent_account_id !== account.parent_account_id) {
            if (updateData.parent_account_id === id) {
                throw new common_1.BadRequestException('Account cannot be its own parent');
            }
            const parentAccount = await this.glAccountRepository.findOne({
                where: {
                    id: updateData.parent_account_id,
                    tenant_id: tenantId,
                },
            });
            if (!parentAccount) {
                throw new common_1.BadRequestException('Parent account not found');
            }
        }
        const oldValues = { ...account };
        Object.assign(account, updateData);
        account.updated_by = userId;
        const updatedAccount = await this.glAccountRepository.save(account);
        await this.auditService.logAction(tenantId, userId, 'UPDATE', 'GLAccount', id, oldValues, updatedAccount);
        return updatedAccount;
    }
    async deactivate(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const account = await this.findOne(id);
        if (account.is_system) {
            throw new common_1.BadRequestException('System accounts cannot be deactivated');
        }
        const childAccounts = await this.glAccountRepository.find({
            where: {
                parent_account_id: id,
                tenant_id: tenantId,
                is_active: true,
            },
        });
        if (childAccounts.length > 0) {
            throw new common_1.BadRequestException('Cannot deactivate account with active child accounts');
        }
        const oldValues = { is_active: account.is_active };
        account.is_active = false;
        account.updated_by = userId;
        const deactivatedAccount = await this.glAccountRepository.save(account);
        await this.auditService.logAction(tenantId, userId, 'DEACTIVATE', 'GLAccount', id, oldValues, { is_active: false });
        return deactivatedAccount;
    }
    async getChartOfAccounts() {
        const tenantId = this.tenantService.getCurrentTenantId();
        const accounts = await this.glAccountRepository
            .createQueryBuilder('account')
            .leftJoinAndSelect('account.child_accounts', 'children')
            .where('account.tenant_id = :tenantId', { tenantId })
            .andWhere('account.parent_account_id IS NULL')
            .orderBy('account.account_code', 'ASC')
            .addOrderBy('children.account_code', 'ASC')
            .getMany();
        return accounts;
    }
    async getAccountBalance(accountId, asOfDate) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.findOne(accountId);
        return {
            debit_balance: Number(account.debit_balance),
            credit_balance: Number(account.credit_balance),
            current_balance: Number(account.current_balance),
        };
    }
    async initializeDefaultChart() {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const existingAccounts = await this.glAccountRepository.count({
            where: { tenant_id: tenantId },
        });
        if (existingAccounts > 0) {
            throw new common_1.BadRequestException('Chart of accounts already exists');
        }
        const defaultAccounts = this.getDefaultChartOfAccounts();
        const createdAccounts = [];
        for (const accountData of defaultAccounts) {
            const account = this.glAccountRepository.create({
                ...accountData,
                tenant_id: tenantId,
                is_system: true,
                created_by: userId,
            });
            const savedAccount = await this.glAccountRepository.save(account);
            createdAccounts.push(savedAccount);
        }
        return createdAccounts;
    }
    getDefaultNormalBalance(accountType) {
        switch (accountType) {
            case 'asset':
            case 'expense':
                return 'debit';
            case 'liability':
            case 'equity':
            case 'revenue':
                return 'credit';
            default:
                return 'debit';
        }
    }
    getDefaultChartOfAccounts() {
        return [
            { account_code: '1000', account_name: 'Assets', account_type: 'asset', account_subtype: 'header', normal_balance: 'debit' },
            { account_code: '1100', account_name: 'Current Assets', account_type: 'asset', account_subtype: 'current_asset', normal_balance: 'debit' },
            { account_code: '1110', account_name: 'Cash and Cash Equivalents', account_type: 'asset', account_subtype: 'cash', normal_balance: 'debit' },
            { account_code: '1120', account_name: 'Accounts Receivable', account_type: 'asset', account_subtype: 'receivable', normal_balance: 'debit' },
            { account_code: '1200', account_name: 'Fixed Assets', account_type: 'asset', account_subtype: 'fixed_asset', normal_balance: 'debit' },
            { account_code: '2000', account_name: 'Liabilities', account_type: 'liability', account_subtype: 'header', normal_balance: 'credit' },
            { account_code: '2100', account_name: 'Current Liabilities', account_type: 'liability', account_subtype: 'current_liability', normal_balance: 'credit' },
            { account_code: '2110', account_name: 'Accounts Payable', account_type: 'liability', account_subtype: 'payable', normal_balance: 'credit' },
            { account_code: '3000', account_name: 'Equity', account_type: 'equity', account_subtype: 'header', normal_balance: 'credit' },
            { account_code: '3100', account_name: 'Fund Balance', account_type: 'equity', account_subtype: 'fund_balance', normal_balance: 'credit' },
            { account_code: '4000', account_name: 'Revenue', account_type: 'revenue', account_subtype: 'header', normal_balance: 'credit' },
            { account_code: '4100', account_name: 'Government Revenue', account_type: 'revenue', account_subtype: 'government', normal_balance: 'credit' },
            { account_code: '5000', account_name: 'Expenses', account_type: 'expense', account_subtype: 'header', normal_balance: 'debit' },
            { account_code: '5100', account_name: 'Personnel Costs', account_type: 'expense', account_subtype: 'personnel', normal_balance: 'debit' },
            { account_code: '5200', account_name: 'Overhead Costs', account_type: 'expense', account_subtype: 'overhead', normal_balance: 'debit' },
            { account_code: '5300', account_name: 'Capital Expenditure', account_type: 'expense', account_subtype: 'capital', normal_balance: 'debit' },
        ];
    }
};
exports.GLAccountsService = GLAccountsService;
exports.GLAccountsService = GLAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gl_account_entity_1.GLAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], GLAccountsService);
//# sourceMappingURL=gl-accounts.service.js.map