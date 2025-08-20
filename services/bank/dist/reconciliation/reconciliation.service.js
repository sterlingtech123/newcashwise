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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reconciliation_entity_1 = require("./entities/reconciliation.entity");
const reconciliation_item_entity_1 = require("./entities/reconciliation-item.entity");
const bank_account_entity_1 = require("../bank-accounts/entities/bank-account.entity");
const bank_transaction_entity_1 = require("../transactions/entities/bank-transaction.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let ReconciliationService = class ReconciliationService {
    constructor(reconciliationRepository, reconciliationItemRepository, bankAccountRepository, transactionRepository, dataSource, tenantService, auditService) {
        this.reconciliationRepository = reconciliationRepository;
        this.reconciliationItemRepository = reconciliationItemRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.transactionRepository = transactionRepository;
        this.dataSource = dataSource;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async startReconciliation(createDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bankAccount = await queryRunner.manager.findOne(bank_account_entity_1.BankAccount, {
                where: { id: createDto.bank_account_id, tenant_id: tenantId },
            });
            if (!bankAccount) {
                throw new common_1.NotFoundException('Bank account not found');
            }
            const existingReconciliation = await queryRunner.manager.findOne(reconciliation_entity_1.Reconciliation, {
                where: {
                    tenant_id: tenantId,
                    bank_account_id: createDto.bank_account_id,
                    status: 'pending',
                },
            });
            if (existingReconciliation) {
                throw new common_1.BadRequestException('There is already a pending reconciliation for this account');
            }
            const lastReconciliation = await queryRunner.manager.findOne(reconciliation_entity_1.Reconciliation, {
                where: {
                    tenant_id: tenantId,
                    bank_account_id: createDto.bank_account_id,
                    status: 'completed',
                },
                order: { reconciliation_date: 'DESC' },
            });
            const openingBalance = lastReconciliation?.closing_balance || 0;
            const periodEnd = new Date(createDto.period_end_date);
            const closingBalance = await this.calculateBookBalance(tenantId, createDto.bank_account_id, periodEnd);
            const reconciliation = this.reconciliationRepository.create({
                tenant_id: tenantId,
                bank_account_id: createDto.bank_account_id,
                reconciliation_date: new Date(),
                period_start_date: new Date(createDto.period_start_date),
                period_end_date: periodEnd,
                opening_balance: openingBalance,
                closing_balance: closingBalance,
                statement_opening_balance: createDto.statement_opening_balance,
                statement_closing_balance: createDto.statement_closing_balance,
                statement_reference: createDto.statement_reference,
                statement_date: createDto.statement_date ? new Date(createDto.statement_date) : null,
                status: 'pending',
                created_by: userId,
            });
            reconciliation.variance = reconciliation.calculateVariance();
            const savedReconciliation = await queryRunner.manager.save(reconciliation);
            await this.loadBookTransactions(queryRunner, savedReconciliation);
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'CREATE', 'Reconciliation', savedReconciliation.id, null, savedReconciliation);
            return this.findOne(savedReconciliation.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async addStatementItems(reconciliationId, statementItems) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const reconciliation = await this.findOne(reconciliationId);
        if (reconciliation.status !== 'pending') {
            throw new common_1.BadRequestException('Can only add statement items to pending reconciliations');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const items = statementItems.map(item => {
                return this.reconciliationItemRepository.create({
                    tenant_id: tenantId,
                    reconciliation_id: reconciliationId,
                    item_type: 'statement_item',
                    transaction_date: new Date(item.date),
                    description: item.description,
                    amount: item.amount,
                    transaction_type: item.type,
                    statement_reference: item.reference,
                    status: 'unmatched',
                    statement_data: item.statement_data,
                    created_by: userId,
                });
            });
            await queryRunner.manager.save(items);
            await queryRunner.manager.update(reconciliation_entity_1.Reconciliation, { id: reconciliationId }, {
                status: 'in_progress',
                updated_by: userId,
            });
            await queryRunner.commitTransaction();
            await this.performAutoMatching(reconciliationId);
            return this.findOne(reconciliationId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async performAutoMatching(reconciliationId) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const unmatchedItems = await this.reconciliationItemRepository.find({
            where: {
                tenant_id: tenantId,
                reconciliation_id: reconciliationId,
                status: 'unmatched',
            },
        });
        const bookItems = unmatchedItems.filter(item => item.item_type === 'book_item');
        const statementItems = unmatchedItems.filter(item => item.item_type === 'statement_item');
        let matchCount = 0;
        for (const bookItem of bookItems) {
            const exactMatch = statementItems.find(statementItem => Math.abs(Number(bookItem.amount) - Number(statementItem.amount)) < 0.01 &&
                bookItem.transaction_type === statementItem.transaction_type &&
                Math.abs(bookItem.transaction_date.getTime() - statementItem.transaction_date.getTime()) <= 7 * 24 * 60 * 60 * 1000);
            if (exactMatch) {
                await this.matchItems(bookItem.id, exactMatch.id, 'auto_exact_match');
                matchCount++;
            }
            else {
                const referenceMatch = statementItems.find(statementItem => bookItem.reference_number &&
                    statementItem.statement_reference &&
                    bookItem.reference_number === statementItem.statement_reference);
                if (referenceMatch) {
                    await this.matchItems(bookItem.id, referenceMatch.id, 'auto_reference_match');
                    matchCount++;
                }
            }
        }
        await this.updateReconciliationStats(reconciliationId);
        await this.auditService.logAction(tenantId, userId, 'AUTO_MATCH', 'Reconciliation', reconciliationId, null, { matched_items: matchCount });
    }
    async matchItems(bookItemId, statementItemId, reason) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(reconciliation_item_entity_1.ReconciliationItem, { id: bookItemId, tenant_id: tenantId }, {
                status: 'matched',
                matched_with_id: statementItemId,
                matched_at: new Date(),
                matched_by: userId,
                match_reason: reason,
            });
            await queryRunner.manager.update(reconciliation_item_entity_1.ReconciliationItem, { id: statementItemId, tenant_id: tenantId }, {
                status: 'matched',
                matched_with_id: bookItemId,
                matched_at: new Date(),
                matched_by: userId,
                match_reason: reason,
            });
            const bookItem = await queryRunner.manager.findOne(reconciliation_item_entity_1.ReconciliationItem, {
                where: { id: bookItemId },
            });
            if (bookItem?.bank_transaction_id) {
                await queryRunner.manager.update(bank_transaction_entity_1.BankTransaction, { id: bookItem.bank_transaction_id }, { reconciliation_status: 'reconciled' });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async unmatchItems(itemId) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const item = await this.reconciliationItemRepository.findOne({
            where: { id: itemId, tenant_id: tenantId },
        });
        if (!item || !item.matched_with_id) {
            throw new common_1.BadRequestException('Item is not matched');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(reconciliation_item_entity_1.ReconciliationItem, { id: itemId, tenant_id: tenantId }, {
                status: 'unmatched',
                matched_with_id: null,
                matched_at: null,
                matched_by: null,
                match_reason: null,
            });
            await queryRunner.manager.update(reconciliation_item_entity_1.ReconciliationItem, { id: item.matched_with_id, tenant_id: tenantId }, {
                status: 'unmatched',
                matched_with_id: null,
                matched_at: null,
                matched_by: null,
                match_reason: null,
            });
            if (item.bank_transaction_id) {
                await queryRunner.manager.update(bank_transaction_entity_1.BankTransaction, { id: item.bank_transaction_id }, { reconciliation_status: 'unreconciled' });
            }
            await queryRunner.commitTransaction();
            await this.updateReconciliationStats(item.reconciliation_id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async completeReconciliation(reconciliationId) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const reconciliation = await this.findOne(reconciliationId);
        if (reconciliation.status !== 'in_progress') {
            throw new common_1.BadRequestException('Can only complete in-progress reconciliations');
        }
        const outstandingItems = await this.reconciliationItemRepository.find({
            where: {
                tenant_id: tenantId,
                reconciliation_id: reconciliationId,
                status: 'unmatched',
            },
        });
        let outstandingCredits = 0;
        let outstandingDebits = 0;
        outstandingItems.forEach(item => {
            if (item.item_type === 'book_item') {
                if (item.isCredit()) {
                    outstandingCredits += Number(item.amount);
                }
                else {
                    outstandingDebits += Number(item.amount);
                }
            }
        });
        const updatedData = {
            status: 'completed',
            outstanding_credits: outstandingCredits,
            outstanding_debits: outstandingDebits,
            variance: reconciliation.calculateVariance(),
            updated_by: userId,
        };
        await this.reconciliationRepository.update({ id: reconciliationId, tenant_id: tenantId }, updatedData);
        await this.bankAccountRepository.update({ id: reconciliation.bank_account_id }, { last_reconciled_date: reconciliation.period_end_date });
        await this.auditService.logAction(tenantId, userId, 'COMPLETE', 'Reconciliation', reconciliationId, { status: 'in_progress' }, { status: 'completed', variance: updatedData.variance });
        return this.findOne(reconciliationId);
    }
    async findAll(filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.reconciliationRepository
            .createQueryBuilder('reconciliation')
            .leftJoinAndSelect('reconciliation.bank_account', 'account')
            .where('reconciliation.tenant_id = :tenantId', { tenantId })
            .orderBy('reconciliation.reconciliation_date', 'DESC');
        if (filters?.bank_account_id) {
            queryBuilder.andWhere('reconciliation.bank_account_id = :accountId', {
                accountId: filters.bank_account_id
            });
        }
        if (filters?.status) {
            queryBuilder.andWhere('reconciliation.status = :status', {
                status: filters.status
            });
        }
        if (filters?.date_from) {
            queryBuilder.andWhere('reconciliation.reconciliation_date >= :dateFrom', {
                dateFrom: filters.date_from
            });
        }
        if (filters?.date_to) {
            queryBuilder.andWhere('reconciliation.reconciliation_date <= :dateTo', {
                dateTo: filters.date_to
            });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const reconciliation = await this.reconciliationRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['bank_account', 'items'],
        });
        if (!reconciliation) {
            throw new common_1.NotFoundException(`Reconciliation with ID ${id} not found`);
        }
        return reconciliation;
    }
    async loadBookTransactions(queryRunner, reconciliation) {
        const transactions = await queryRunner.manager.find(bank_transaction_entity_1.BankTransaction, {
            where: {
                tenant_id: reconciliation.tenant_id,
                bank_account_id: reconciliation.bank_account_id,
                transaction_date: (0, typeorm_2.Between)(reconciliation.period_start_date, reconciliation.period_end_date),
                status: 'posted',
            },
            order: { transaction_date: 'ASC' },
        });
        const items = transactions.map(transaction => {
            return this.reconciliationItemRepository.create({
                tenant_id: reconciliation.tenant_id,
                reconciliation_id: reconciliation.id,
                bank_transaction_id: transaction.id,
                item_type: 'book_item',
                transaction_date: transaction.transaction_date,
                description: transaction.description,
                amount: transaction.amount,
                transaction_type: transaction.transaction_type,
                reference_number: transaction.reference_number,
                status: 'unmatched',
                created_by: reconciliation.created_by,
            });
        });
        await queryRunner.manager.save(items);
    }
    async calculateBookBalance(tenantId, accountId, asOfDate) {
        const result = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('SUM(CASE WHEN transaction_type = \'credit\' THEN amount ELSE -amount END)', 'balance')
            .where('tenant_id = :tenantId', { tenantId })
            .andWhere('bank_account_id = :accountId', { accountId })
            .andWhere('transaction_date <= :asOfDate', { asOfDate })
            .andWhere('status = :status', { status: 'posted' })
            .getRawOne();
        return Number(result?.balance || 0);
    }
    async updateReconciliationStats(reconciliationId) {
        const items = await this.reconciliationItemRepository.find({
            where: { reconciliation_id: reconciliationId },
        });
        const matchedCount = items.filter(item => item.status === 'matched').length;
        const unmatchedCount = items.filter(item => item.status === 'unmatched').length;
        await this.reconciliationRepository.update({ id: reconciliationId }, {
            matched_items_count: matchedCount,
            unmatched_items_count: unmatchedCount,
        });
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reconciliation_entity_1.Reconciliation)),
    __param(1, (0, typeorm_1.InjectRepository)(reconciliation_item_entity_1.ReconciliationItem)),
    __param(2, (0, typeorm_1.InjectRepository)(bank_account_entity_1.BankAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(bank_transaction_entity_1.BankTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map