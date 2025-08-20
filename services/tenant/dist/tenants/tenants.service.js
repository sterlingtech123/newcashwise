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
var TenantsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let TenantsService = TenantsService_1 = class TenantsService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(TenantsService_1.name);
    }
    async create(createTenantDto) {
        try {
            const existing = await this.prisma.$queryRaw `
        SELECT id FROM tenant.tenants WHERE code = ${createTenantDto.code}
      `;
            if (Array.isArray(existing) && existing.length > 0) {
                throw new common_1.ConflictException(`Tenant with code ${createTenantDto.code} already exists`);
            }
            const [tenant] = await this.prisma.$queryRaw `
        INSERT INTO tenant.tenants (name, code, state_code, description, settings, is_active)
        VALUES (${createTenantDto.name}, ${createTenantDto.code}, ${createTenantDto.stateCode}, 
                ${createTenantDto.description || null}, ${JSON.stringify(createTenantDto.settings || {})}, 
                ${createTenantDto.isActive ?? true})
        RETURNING *
      `;
            await this.createDefaultRoles(tenant.id);
            await this.createDefaultChartOfAccounts(tenant.id);
            this.eventEmitter.emit('tenant.created', { tenant });
            this.logger.log(`Tenant created: ${tenant.name} (${tenant.code})`);
            return tenant;
        }
        catch (error) {
            this.logger.error('Error creating tenant', error);
            throw error;
        }
    }
    async findAll(isActive) {
        const query = isActive !== undefined
            ? `SELECT * FROM tenant.tenants WHERE is_active = ${isActive} ORDER BY name`
            : `SELECT * FROM tenant.tenants ORDER BY name`;
        return this.prisma.$queryRaw(query);
    }
    async findOne(id) {
        const [tenant] = await this.prisma.$queryRaw `
      SELECT * FROM tenant.tenants WHERE id = ${id}::uuid
    `;
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }
    async findByCode(code) {
        const [tenant] = await this.prisma.$queryRaw `
      SELECT * FROM tenant.tenants WHERE code = ${code}
    `;
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with code ${code} not found`);
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        await this.findOne(id);
        const updateFields = [];
        const values = [];
        let paramIndex = 1;
        if (updateTenantDto.name !== undefined) {
            updateFields.push(`name = $${paramIndex++}`);
            values.push(updateTenantDto.name);
        }
        if (updateTenantDto.description !== undefined) {
            updateFields.push(`description = $${paramIndex++}`);
            values.push(updateTenantDto.description);
        }
        if (updateTenantDto.settings !== undefined) {
            updateFields.push(`settings = $${paramIndex++}`);
            values.push(JSON.stringify(updateTenantDto.settings));
        }
        if (updateTenantDto.isActive !== undefined) {
            updateFields.push(`is_active = $${paramIndex++}`);
            values.push(updateTenantDto.isActive);
        }
        if (updateFields.length === 0) {
            return this.findOne(id);
        }
        values.push(id);
        const query = `
      UPDATE tenant.tenants 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}::uuid
      RETURNING *
    `;
        const [tenant] = await this.prisma.$queryRawUnsafe(query, ...values);
        this.eventEmitter.emit('tenant.updated', { tenant });
        return tenant;
    }
    async remove(id) {
        await this.update(id, { isActive: false });
        this.eventEmitter.emit('tenant.deactivated', { tenantId: id });
    }
    async setTenantContext(tenantId, userId) {
        await this.prisma.$executeRaw `
      SELECT set_user_context(${userId || null}::uuid, ${tenantId}::uuid)
    `;
    }
    async getTenantStats(tenantId) {
        const stats = await this.prisma.$queryRaw `
      SELECT 
        (SELECT COUNT(*) FROM auth.users WHERE tenant_id = ${tenantId}::uuid) as user_count,
        (SELECT COUNT(*) FROM budget.organizations WHERE tenant_id = ${tenantId}::uuid) as organization_count,
        (SELECT COUNT(*) FROM budget.budget_versions WHERE tenant_id = ${tenantId}::uuid AND status = 'active') as active_budgets,
        (SELECT COUNT(*) FROM payment.invoices WHERE tenant_id = ${tenantId}::uuid AND status = 'pending') as pending_invoices,
        (SELECT COUNT(*) FROM payment.payment_vouchers WHERE tenant_id = ${tenantId}::uuid AND status = 'pending') as pending_pvs,
        (SELECT COALESCE(SUM(current_balance), 0) FROM bank.bank_accounts WHERE tenant_id = ${tenantId}::uuid) as total_cash_balance
    `;
        return stats[0];
    }
    async createDefaultRoles(tenantId) {
        const defaultRoles = [
            {
                name: 'Super Admin',
                description: 'Full system access',
                permissions: ['*'],
                isSystemRole: true,
            },
            {
                name: 'Budget Officer',
                description: 'Manage budgets and allocations',
                permissions: ['budget.*', 'reports.view'],
                isSystemRole: true,
            },
            {
                name: 'Treasury Officer',
                description: 'Manage payments and treasury',
                permissions: ['payment.*', 'bank.*', 'reports.view'],
                isSystemRole: true,
            },
            {
                name: 'Auditor',
                description: 'View and audit all transactions',
                permissions: ['*.view', 'audit.*', 'reports.*'],
                isSystemRole: true,
            },
            {
                name: 'MDA User',
                description: 'Basic MDA user access',
                permissions: ['budget.view', 'payment.create', 'payment.view'],
                isSystemRole: true,
            },
        ];
        for (const role of defaultRoles) {
            await this.prisma.$executeRaw `
        INSERT INTO auth.roles (tenant_id, name, description, permissions, is_system_role)
        VALUES (${tenantId}::uuid, ${role.name}, ${role.description}, 
                ${JSON.stringify(role.permissions)}, ${role.isSystemRole})
      `;
        }
    }
    async createDefaultChartOfAccounts(tenantId) {
        const defaultAccounts = [
            { code: '1000', name: 'Assets', type: 'asset', parentCode: null },
            { code: '1010', name: 'Cash and Cash Equivalents', type: 'asset', parentCode: '1000' },
            { code: '1020', name: 'Accounts Receivable', type: 'asset', parentCode: '1000' },
            { code: '1030', name: 'Fixed Assets', type: 'asset', parentCode: '1000' },
            { code: '2000', name: 'Liabilities', type: 'liability', parentCode: null },
            { code: '2010', name: 'Accounts Payable', type: 'liability', parentCode: '2000' },
            { code: '2020', name: 'Accrued Liabilities', type: 'liability', parentCode: '2000' },
            { code: '2030', name: 'Long-term Debt', type: 'liability', parentCode: '2000' },
            { code: '3000', name: 'Fund Balance', type: 'equity', parentCode: null },
            { code: '3010', name: 'Unrestricted Fund Balance', type: 'equity', parentCode: '3000' },
            { code: '3020', name: 'Restricted Fund Balance', type: 'equity', parentCode: '3000' },
            { code: '4000', name: 'Revenue', type: 'revenue', parentCode: null },
            { code: '4010', name: 'Tax Revenue', type: 'revenue', parentCode: '4000' },
            { code: '4020', name: 'Federal Allocations', type: 'revenue', parentCode: '4000' },
            { code: '4030', name: 'Grants', type: 'revenue', parentCode: '4000' },
            { code: '5000', name: 'Expenses', type: 'expense', parentCode: null },
            { code: '5010', name: 'Personnel Costs', type: 'expense', parentCode: '5000' },
            { code: '5020', name: 'Overhead Costs', type: 'expense', parentCode: '5000' },
            { code: '5030', name: 'Capital Expenditure', type: 'expense', parentCode: '5000' },
        ];
        const parentAccounts = defaultAccounts.filter(a => a.parentCode === null);
        const childAccounts = defaultAccounts.filter(a => a.parentCode !== null);
        for (const account of parentAccounts) {
            await this.prisma.$executeRaw `
        INSERT INTO accounting.chart_of_accounts (
          tenant_id, account_code, account_name, account_type, 
          is_active, is_system_account, normal_balance
        ) VALUES (
          ${tenantId}::uuid, ${account.code}, ${account.name}, ${account.type},
          true, true, ${account.type === 'asset' || account.type === 'expense' ? 'debit' : 'credit'}
        )
      `;
        }
        for (const account of childAccounts) {
            await this.prisma.$executeRaw `
        INSERT INTO accounting.chart_of_accounts (
          tenant_id, account_code, account_name, account_type,
          parent_account_id, is_active, is_system_account, normal_balance
        ) VALUES (
          ${tenantId}::uuid, ${account.code}, ${account.name}, ${account.type},
          (SELECT id FROM accounting.chart_of_accounts 
           WHERE tenant_id = ${tenantId}::uuid AND account_code = ${account.parentCode}),
          true, true, ${account.type === 'asset' || account.type === 'expense' ? 'debit' : 'credit'}
        )
      `;
        }
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, event_emitter_1.EventEmitter2])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map