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
var BudgetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let BudgetsService = BudgetsService_1 = class BudgetsService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(BudgetsService_1.name);
    }
    async createBudgetVersion(tenantId, createBudgetDto) {
        try {
            const fiscalYears = await this.prisma.$queryRaw `
        SELECT * FROM budget.fiscal_years 
        WHERE id = ${createBudgetDto.fiscalYearId}::uuid 
        AND tenant_id = ${tenantId}::uuid
      `;
            const fiscalYear = fiscalYears[0];
            if (!fiscalYear) {
                throw new common_1.NotFoundException('Fiscal year not found');
            }
            const budgetVersions = await this.prisma.$queryRaw `
        INSERT INTO budget.budget_versions (
          tenant_id, fiscal_year_id, version_number, name, description,
          status, budget_type, total_amount
        ) VALUES (
          ${tenantId}::uuid, ${createBudgetDto.fiscalYearId}::uuid,
          ${createBudgetDto.versionNumber}, ${createBudgetDto.name},
          ${createBudgetDto.description}, ${createBudgetDto.status || 'draft'},
          ${createBudgetDto.budgetType}, ${createBudgetDto.totalAmount}
        ) RETURNING *
      `;
            const budgetVersion = budgetVersions[0];
            this.logger.log(`Budget version created: ${budgetVersion.name}`);
            this.eventEmitter.emit('budget.version.created', {
                tenantId,
                budgetVersion,
            });
            return budgetVersion;
        }
        catch (error) {
            this.logger.error('Error creating budget version', error);
            throw error;
        }
    }
    async createBudgetLine(tenantId, createBudgetLineDto) {
        try {
            await this.validateBudgetLineReferences(tenantId, createBudgetLineDto);
            const budgetLines = await this.prisma.$queryRaw `
        INSERT INTO budget.budget_lines (
          tenant_id, budget_version_id, organization_id, fund_id,
          function_id, economic_head_id, program_id, project_id,
          line_number, description, approved_amount, tags
        ) VALUES (
          ${tenantId}::uuid, ${createBudgetLineDto.budgetVersionId}::uuid,
          ${createBudgetLineDto.organizationId}::uuid, ${createBudgetLineDto.fundId}::uuid,
          ${createBudgetLineDto.functionId}::uuid, ${createBudgetLineDto.economicHeadId}::uuid,
          ${createBudgetLineDto.programId || null}::uuid, ${createBudgetLineDto.projectId || null}::uuid,
          ${createBudgetLineDto.lineNumber}, ${createBudgetLineDto.description},
          ${createBudgetLineDto.approvedAmount}, ${JSON.stringify(createBudgetLineDto.tags || [])}
        ) RETURNING *
      `;
            const budgetLine = budgetLines[0];
            await this.updateBudgetVersionTotal(createBudgetLineDto.budgetVersionId);
            this.logger.log(`Budget line created: ${budgetLine.line_number}`);
            return budgetLine;
        }
        catch (error) {
            this.logger.error('Error creating budget line', error);
            throw error;
        }
    }
    async createAllotment(tenantId, createAllotmentDto) {
        try {
            const availability = await this.checkBudgetAvailability(tenantId, createAllotmentDto.budgetLineId, createAllotmentDto.amount);
            if (!availability.available) {
                throw new common_1.BadRequestException(`Insufficient budget. Approved: ${availability.approvedAmount}, Already allotted: ${availability.allottedAmount}`);
            }
            const allotments = await this.prisma.$queryRaw `
        INSERT INTO budget.allotments (
          tenant_id, budget_line_id, amount, allotment_date,
          reference_number, description, status, created_by
        ) VALUES (
          ${tenantId}::uuid, ${createAllotmentDto.budgetLineId}::uuid,
          ${createAllotmentDto.amount}, ${createAllotmentDto.allotmentDate},
          ${createAllotmentDto.referenceNumber}, ${createAllotmentDto.description},
          ${createAllotmentDto.status || 'active'}, ${createAllotmentDto.createdBy}::uuid
        ) RETURNING *
      `;
            const allotment = allotments[0];
            this.eventEmitter.emit('budget.allotment.created', {
                tenantId,
                allotment,
                budgetLineId: createAllotmentDto.budgetLineId,
            });
            this.logger.log(`Allotment created: ${allotment.reference_number}`);
            return allotment;
        }
        catch (error) {
            this.logger.error('Error creating allotment', error);
            throw error;
        }
    }
    async createCommitment(tenantId, createCommitmentDto) {
        try {
            const availability = await this.checkBudgetAvailability(tenantId, createCommitmentDto.budgetLineId, createCommitmentDto.amount);
            if (!availability.available) {
                throw new common_1.BadRequestException(`Insufficient budget. Available: ${availability.availableAmount}, Requested: ${createCommitmentDto.amount}`);
            }
            const commitments = await this.prisma.$queryRaw `
        INSERT INTO budget.commitments (
          tenant_id, budget_line_id, amount, commitment_date,
          reference_number, description, vendor_name, status, created_by
        ) VALUES (
          ${tenantId}::uuid, ${createCommitmentDto.budgetLineId}::uuid,
          ${createCommitmentDto.amount}, ${createCommitmentDto.commitmentDate},
          ${createCommitmentDto.referenceNumber}, ${createCommitmentDto.description},
          ${createCommitmentDto.vendorName}, ${createCommitmentDto.status || 'active'},
          ${createCommitmentDto.createdBy}::uuid
        ) RETURNING *
      `;
            const commitment = commitments[0];
            this.eventEmitter.emit('budget.commitment.created', {
                tenantId,
                commitment,
                budgetLineId: createCommitmentDto.budgetLineId,
            });
            this.logger.log(`Commitment created: ${commitment.reference_number}`);
            return commitment;
        }
        catch (error) {
            this.logger.error('Error creating commitment', error);
            throw error;
        }
    }
    async checkBudgetAvailability(tenantId, budgetLineId, requestedAmount) {
        const [result] = await this.prisma.$queryRaw `
      SELECT * FROM budget.check_budget_availability(
        ${tenantId}::uuid,
        ${budgetLineId}::uuid,
        ${requestedAmount}::decimal
      )
    `;
        return {
            available: result.available,
            approvedAmount: parseFloat(result.approved_amount),
            allottedAmount: parseFloat(result.allotted_amount),
            committedAmount: parseFloat(result.committed_amount),
            obligatedAmount: parseFloat(result.obligated_amount),
            availableAmount: parseFloat(result.available_amount),
            requestedAmount: parseFloat(result.requested_amount),
        };
    }
    async getBudgetUtilization(tenantId, organizationId, fiscalYear) {
        let query = `
      SELECT * FROM budget.mv_budget_utilization
      WHERE tenant_id = ${tenantId}::uuid
    `;
        if (organizationId) {
            query += ` AND organization_code = (
        SELECT code FROM budget.organizations 
        WHERE id = ${organizationId}::uuid AND tenant_id = ${tenantId}::uuid
      )`;
        }
        if (fiscalYear) {
            query += ` AND fiscal_year = ${fiscalYear}`;
        }
        query += ' ORDER BY organization_name, economic_head_name';
        return this.prisma.$queryRawUnsafe(query);
    }
    async getBudgetPipeline(tenantId, organizationId) {
        let query = `
      SELECT * FROM budget.mv_budget_pipeline
      WHERE tenant_id = ${tenantId}::uuid
    `;
        if (organizationId) {
            query += ` AND organization_code = (
        SELECT code FROM budget.organizations 
        WHERE id = ${organizationId}::uuid AND tenant_id = ${tenantId}::uuid
      )`;
        }
        query += ' ORDER BY organization_name';
        return this.prisma.$queryRawUnsafe(query);
    }
    async importBudgetFromCSV(tenantId, fileBuffer, budgetVersionId) {
        this.logger.log('Importing budget from CSV...');
        return {
            message: 'Budget import initiated',
            budgetVersionId,
            status: 'processing',
        };
    }
    async approveBudgetVersion(tenantId, budgetVersionId, approvedBy) {
        const budgetVersions = await this.prisma.$queryRaw `
      UPDATE budget.budget_versions
      SET status = 'approved',
          approved_at = NOW(),
          approved_by = ${approvedBy}::uuid,
          updated_at = NOW()
      WHERE id = ${budgetVersionId}::uuid
      AND tenant_id = ${tenantId}::uuid
      AND status = 'submitted'
      RETURNING *
    `;
        const budgetVersion = budgetVersions[0];
        if (!budgetVersion) {
            throw new common_1.NotFoundException('Budget version not found or not in submitted status');
        }
        await this.prisma.$executeRaw `
      UPDATE budget.budget_versions
      SET status = 'archived'
      WHERE fiscal_year_id = ${budgetVersion.fiscal_year_id}::uuid
      AND budget_type = ${budgetVersion.budget_type}
      AND tenant_id = ${tenantId}::uuid
      AND id != ${budgetVersionId}::uuid
      AND status = 'active'
    `;
        await this.prisma.$executeRaw `
      UPDATE budget.budget_versions
      SET status = 'active'
      WHERE id = ${budgetVersionId}::uuid
    `;
        this.eventEmitter.emit('budget.version.approved', {
            tenantId,
            budgetVersion,
            approvedBy,
        });
        return budgetVersion;
    }
    async releaseCommitment(tenantId, commitmentId, amount) {
        const commitments = await this.prisma.$queryRaw `
      SELECT * FROM budget.commitments
      WHERE id = ${commitmentId}::uuid
      AND tenant_id = ${tenantId}::uuid
      AND status = 'active'
    `;
        const commitment = commitments[0];
        if (!commitment) {
            throw new common_1.NotFoundException('Active commitment not found');
        }
        const releaseAmount = amount || commitment.amount;
        if (releaseAmount > commitment.amount) {
            throw new common_1.BadRequestException('Release amount cannot exceed commitment amount');
        }
        if (releaseAmount === commitment.amount) {
            await this.prisma.$executeRaw `
        UPDATE budget.commitments
        SET status = 'liquidated',
            updated_at = NOW()
        WHERE id = ${commitmentId}::uuid
      `;
        }
        else {
            await this.prisma.$executeRaw `
        UPDATE budget.commitments
        SET amount = amount - ${releaseAmount}::decimal,
            updated_at = NOW()
        WHERE id = ${commitmentId}::uuid
      `;
        }
        this.eventEmitter.emit('budget.commitment.released', {
            tenantId,
            commitmentId,
            releaseAmount,
            budgetLineId: commitment.budget_line_id,
        });
        return {
            message: 'Commitment released successfully',
            releaseAmount,
            remainingCommitment: commitment.amount - releaseAmount,
        };
    }
    async validateBudgetLineReferences(tenantId, dto) {
        const orgs = await this.prisma.$queryRaw `
      SELECT id FROM budget.organizations 
      WHERE id = ${dto.organizationId}::uuid AND tenant_id = ${tenantId}::uuid
    `;
        const org = orgs[0];
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        const funds = await this.prisma.$queryRaw `
      SELECT id FROM budget.funds 
      WHERE id = ${dto.fundId}::uuid AND tenant_id = ${tenantId}::uuid
    `;
        const fund = funds[0];
        if (!fund)
            throw new common_1.NotFoundException('Fund not found');
        const funcs = await this.prisma.$queryRaw `
      SELECT id FROM budget.functions 
      WHERE id = ${dto.functionId}::uuid AND tenant_id = ${tenantId}::uuid
    `;
        const func = funcs[0];
        if (!func)
            throw new common_1.NotFoundException('Function not found');
        const economicHeads = await this.prisma.$queryRaw `
      SELECT id FROM budget.economic_heads 
      WHERE id = ${dto.economicHeadId}::uuid AND tenant_id = ${tenantId}::uuid
    `;
        const economicHead = economicHeads[0];
        if (!economicHead)
            throw new common_1.NotFoundException('Economic head not found');
    }
    async updateBudgetVersionTotal(budgetVersionId) {
        await this.prisma.$executeRaw `
      UPDATE budget.budget_versions
      SET total_amount = (
        SELECT COALESCE(SUM(approved_amount), 0)
        FROM budget.budget_lines
        WHERE budget_version_id = ${budgetVersionId}::uuid
      ),
      updated_at = NOW()
      WHERE id = ${budgetVersionId}::uuid
    `;
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = BudgetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map