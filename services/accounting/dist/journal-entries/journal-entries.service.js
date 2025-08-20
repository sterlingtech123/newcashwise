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
exports.JournalEntriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const decimal_js_1 = require("decimal.js");
const journal_entry_entity_1 = require("./entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("./entities/journal-entry-line.entity");
const gl_account_entity_1 = require("../gl-accounts/entities/gl-account.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let JournalEntriesService = class JournalEntriesService {
    constructor(journalEntryRepository, journalEntryLineRepository, glAccountRepository, dataSource, tenantService, auditService) {
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.glAccountRepository = glAccountRepository;
        this.dataSource = dataSource;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createJournalEntryDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        await this.validateJournalEntry(createJournalEntryDto, tenantId);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const referenceNumber = await this.generateReferenceNumber(tenantId);
            const { totalDebits, totalCredits } = this.calculateTotals(createJournalEntryDto.lines);
            const journalEntry = this.journalEntryRepository.create({
                tenant_id: tenantId,
                entry_date: new Date(createJournalEntryDto.entry_date),
                reference_number: referenceNumber,
                description: createJournalEntryDto.description,
                source_type: createJournalEntryDto.source_type || 'manual',
                source_id: createJournalEntryDto.source_id,
                total_debit: totalDebits.toNumber(),
                total_credit: totalCredits.toNumber(),
                status: 'pending',
                notes: createJournalEntryDto.notes,
                created_by: userId,
            });
            const savedEntry = await queryRunner.manager.save(journalEntry);
            const lines = createJournalEntryDto.lines.map(lineDto => {
                const line = this.journalEntryLineRepository.create({
                    tenant_id: tenantId,
                    journal_entry_id: savedEntry.id,
                    gl_account_id: lineDto.gl_account_id,
                    line_date: new Date(createJournalEntryDto.entry_date),
                    description: lineDto.description,
                    debit_amount: lineDto.debit_amount || 0,
                    credit_amount: lineDto.credit_amount || 0,
                    reference_data: lineDto.reference_data,
                    notes: lineDto.notes,
                    created_by: userId,
                });
                return line;
            });
            await queryRunner.manager.save(lines);
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'CREATE', 'JournalEntry', savedEntry.id, null, savedEntry);
            return this.findOne(savedEntry.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(page = 1, limit = 50, filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.journalEntryRepository
            .createQueryBuilder('je')
            .leftJoinAndSelect('je.lines', 'lines')
            .leftJoinAndSelect('lines.gl_account', 'gl_account')
            .where('je.tenant_id = :tenantId', { tenantId })
            .orderBy('je.entry_date', 'DESC')
            .addOrderBy('je.created_at', 'DESC');
        if (filters?.status) {
            queryBuilder.andWhere('je.status = :status', { status: filters.status });
        }
        if (filters?.source_type) {
            queryBuilder.andWhere('je.source_type = :source_type', { source_type: filters.source_type });
        }
        if (filters?.date_from) {
            queryBuilder.andWhere('je.entry_date >= :date_from', { date_from: filters.date_from });
        }
        if (filters?.date_to) {
            queryBuilder.andWhere('je.entry_date <= :date_to', { date_to: filters.date_to });
        }
        const total = await queryBuilder.getCount();
        const data = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const journalEntry = await this.journalEntryRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['lines', 'lines.gl_account'],
        });
        if (!journalEntry) {
            throw new common_1.NotFoundException(`Journal entry with ID ${id} not found`);
        }
        return journalEntry;
    }
    async postEntry(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const journalEntry = await this.findOne(id);
        if (journalEntry.status !== 'pending') {
            throw new common_1.BadRequestException('Only pending journal entries can be posted');
        }
        if (!journalEntry.validateBalance()) {
            throw new common_1.BadRequestException('Journal entry is not balanced');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(journal_entry_entity_1.JournalEntry, { id, tenant_id: tenantId }, {
                status: 'posted',
                posted_by: userId,
                posted_at: new Date(),
            });
            await this.updateGLAccountBalances(journalEntry.lines, queryRunner);
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'POST', 'JournalEntry', id, { status: 'pending' }, { status: 'posted' });
            return this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async reverseEntry(id, reason) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const originalEntry = await this.findOne(id);
        if (originalEntry.status !== 'posted') {
            throw new common_1.BadRequestException('Only posted journal entries can be reversed');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const reversalReferenceNumber = await this.generateReferenceNumber(tenantId, 'REV');
            const reversalEntry = this.journalEntryRepository.create({
                tenant_id: tenantId,
                entry_date: new Date(),
                reference_number: reversalReferenceNumber,
                description: `Reversal of ${originalEntry.reference_number}: ${reason}`,
                source_type: 'reversal',
                source_id: originalEntry.id,
                total_debit: originalEntry.total_credit,
                total_credit: originalEntry.total_debit,
                status: 'posted',
                notes: `Reversal reason: ${reason}`,
                created_by: userId,
                posted_by: userId,
                posted_at: new Date(),
            });
            const savedReversalEntry = await queryRunner.manager.save(reversalEntry);
            const reversalLines = originalEntry.lines.map(originalLine => {
                return this.journalEntryLineRepository.create({
                    tenant_id: tenantId,
                    journal_entry_id: savedReversalEntry.id,
                    gl_account_id: originalLine.gl_account_id,
                    line_date: new Date(),
                    description: `Reversal: ${originalLine.description}`,
                    debit_amount: originalLine.credit_amount,
                    credit_amount: originalLine.debit_amount,
                    reference_data: { original_line_id: originalLine.id },
                    notes: `Reversal of line: ${originalLine.id}`,
                    created_by: userId,
                });
            });
            await queryRunner.manager.save(reversalLines);
            await queryRunner.manager.update(journal_entry_entity_1.JournalEntry, { id, tenant_id: tenantId }, {
                status: 'reversed',
                reversed_by: userId,
                reversed_at: new Date(),
                reversal_reason: reason,
            });
            await this.updateGLAccountBalances(reversalLines, queryRunner);
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'REVERSE', 'JournalEntry', id, { status: 'posted' }, { status: 'reversed', reversal_reason: reason });
            return savedReversalEntry;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async validateJournalEntry(dto, tenantId) {
        const accountIds = dto.lines.map(line => line.gl_account_id);
        const accounts = await this.glAccountRepository.find({
            where: {
                id: accountIds,
                tenant_id: tenantId,
                is_active: true,
            },
        });
        if (accounts.length !== accountIds.length) {
            throw new common_1.BadRequestException('One or more GL accounts not found or inactive');
        }
        for (const line of dto.lines) {
            const hasDebit = line.debit_amount && line.debit_amount > 0;
            const hasCredit = line.credit_amount && line.credit_amount > 0;
            if ((!hasDebit && !hasCredit) || (hasDebit && hasCredit)) {
                throw new common_1.BadRequestException('Each line must have either a debit amount or a credit amount, but not both');
            }
        }
        const { totalDebits, totalCredits } = this.calculateTotals(dto.lines);
        if (!totalDebits.equals(totalCredits)) {
            throw new common_1.BadRequestException('Total debits must equal total credits');
        }
    }
    calculateTotals(lines) {
        let totalDebits = new decimal_js_1.Decimal(0);
        let totalCredits = new decimal_js_1.Decimal(0);
        for (const line of lines) {
            if (line.debit_amount) {
                totalDebits = totalDebits.plus(new decimal_js_1.Decimal(line.debit_amount));
            }
            if (line.credit_amount) {
                totalCredits = totalCredits.plus(new decimal_js_1.Decimal(line.credit_amount));
            }
        }
        return { totalDebits, totalCredits };
    }
    async generateReferenceNumber(tenantId, prefix = 'JE') {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const count = await this.journalEntryRepository.count({
            where: {
                tenant_id: tenantId,
                reference_number: new RegExp(`^${prefix}-${year}${month}`),
            },
        });
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${year}${month}-${sequence}`;
    }
    async updateGLAccountBalances(lines, queryRunner) {
        for (const line of lines) {
            const debitAmount = new decimal_js_1.Decimal(line.debit_amount || 0);
            const creditAmount = new decimal_js_1.Decimal(line.credit_amount || 0);
            await queryRunner.manager.increment(gl_account_entity_1.GLAccount, { id: line.gl_account_id }, 'debit_balance', debitAmount.toNumber());
            await queryRunner.manager.increment(gl_account_entity_1.GLAccount, { id: line.gl_account_id }, 'credit_balance', creditAmount.toNumber());
            const account = await queryRunner.manager.findOne(gl_account_entity_1.GLAccount, {
                where: { id: line.gl_account_id },
            });
            if (account) {
                const newBalance = account.calculateBalance();
                await queryRunner.manager.update(gl_account_entity_1.GLAccount, { id: line.gl_account_id }, { current_balance: newBalance });
            }
        }
    }
};
exports.JournalEntriesService = JournalEntriesService;
exports.JournalEntriesService = JournalEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(2, (0, typeorm_1.InjectRepository)(gl_account_entity_1.GLAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], JournalEntriesService);
//# sourceMappingURL=journal-entries.service.js.map