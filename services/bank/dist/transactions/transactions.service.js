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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const decimal_js_1 = require("decimal.js");
const bank_transaction_entity_1 = require("./entities/bank-transaction.entity");
const bank_account_entity_1 = require("../bank-accounts/entities/bank-account.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, bankAccountRepository, dataSource, tenantService, auditService) {
        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.dataSource = dataSource;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createTransactionDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bankAccount = await queryRunner.manager.findOne(bank_account_entity_1.BankAccount, {
                where: {
                    id: createTransactionDto.bank_account_id,
                    tenant_id: tenantId
                },
            });
            if (!bankAccount) {
                throw new common_1.NotFoundException('Bank account not found');
            }
            if (!bankAccount.is_active) {
                throw new common_1.BadRequestException('Bank account is not active');
            }
            const referenceNumber = createTransactionDto.reference_number ||
                await this.generateReferenceNumber(tenantId);
            const amount = new decimal_js_1.Decimal(createTransactionDto.amount);
            const currentBalance = new decimal_js_1.Decimal(bankAccount.current_balance || 0);
            const newBalance = createTransactionDto.transaction_type === 'credit'
                ? currentBalance.plus(amount)
                : currentBalance.minus(amount);
            if (createTransactionDto.transaction_type === 'debit') {
                const validation = await this.validateDebitTransaction(bankAccount, amount.toNumber());
                if (!validation.valid) {
                    throw new common_1.BadRequestException(validation.message);
                }
            }
            const transaction = this.transactionRepository.create({
                ...createTransactionDto,
                tenant_id: tenantId,
                transaction_date: new Date(createTransactionDto.transaction_date),
                value_date: createTransactionDto.value_date ?
                    new Date(createTransactionDto.value_date) :
                    new Date(createTransactionDto.transaction_date),
                reference_number: referenceNumber,
                running_balance: createTransactionDto.running_balance || newBalance.toNumber(),
                status: createTransactionDto.status || 'posted',
                reconciliation_status: 'unreconciled',
                created_by: userId,
            });
            const savedTransaction = await queryRunner.manager.save(transaction);
            if (savedTransaction.status === 'posted') {
                await queryRunner.manager.update(bank_account_entity_1.BankAccount, { id: bankAccount.id }, {
                    current_balance: newBalance.toNumber(),
                    available_balance: newBalance.toNumber(),
                    ledger_balance: newBalance.toNumber(),
                });
            }
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'CREATE', 'BankTransaction', savedTransaction.id, null, savedTransaction);
            return this.findOne(savedTransaction.id);
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
        const queryBuilder = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.bank_account', 'account')
            .where('transaction.tenant_id = :tenantId', { tenantId })
            .orderBy('transaction.transaction_date', 'DESC')
            .addOrderBy('transaction.created_at', 'DESC');
        if (filters?.bank_account_id) {
            queryBuilder.andWhere('transaction.bank_account_id = :accountId', {
                accountId: filters.bank_account_id
            });
        }
        if (filters?.transaction_type) {
            queryBuilder.andWhere('transaction.transaction_type = :type', {
                type: filters.transaction_type
            });
        }
        if (filters?.status) {
            queryBuilder.andWhere('transaction.status = :status', {
                status: filters.status
            });
        }
        if (filters?.reconciliation_status) {
            queryBuilder.andWhere('transaction.reconciliation_status = :recStatus', {
                recStatus: filters.reconciliation_status
            });
        }
        if (filters?.category) {
            queryBuilder.andWhere('transaction.transaction_category = :category', {
                category: filters.category
            });
        }
        if (filters?.date_from) {
            queryBuilder.andWhere('transaction.transaction_date >= :dateFrom', {
                dateFrom: filters.date_from
            });
        }
        if (filters?.date_to) {
            queryBuilder.andWhere('transaction.transaction_date <= :dateTo', {
                dateTo: filters.date_to
            });
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
        const transaction = await this.transactionRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['bank_account'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async reverseTransaction(id, reason) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const originalTransaction = await this.findOne(id);
        if (originalTransaction.status !== 'posted') {
            throw new common_1.BadRequestException('Only posted transactions can be reversed');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const reversalReferenceNumber = await this.generateReferenceNumber(tenantId, 'REV');
            const reversalTransaction = this.transactionRepository.create({
                tenant_id: tenantId,
                bank_account_id: originalTransaction.bank_account_id,
                transaction_date: new Date(),
                value_date: new Date(),
                transaction_type: originalTransaction.transaction_type === 'credit' ? 'debit' : 'credit',
                transaction_category: 'reversal',
                amount: originalTransaction.amount,
                description: `Reversal of ${originalTransaction.reference_number}: ${reason}`,
                reference_number: reversalReferenceNumber,
                status: 'posted',
                reconciliation_status: 'unreconciled',
                notes: `Reversal reason: ${reason}`,
                created_by: userId,
            });
            const bankAccount = await queryRunner.manager.findOne(bank_account_entity_1.BankAccount, {
                where: { id: originalTransaction.bank_account_id },
            });
            const currentBalance = new decimal_js_1.Decimal(bankAccount.current_balance || 0);
            const amount = new decimal_js_1.Decimal(originalTransaction.amount);
            const newBalance = originalTransaction.transaction_type === 'credit'
                ? currentBalance.minus(amount)
                : currentBalance.plus(amount);
            reversalTransaction.running_balance = newBalance.toNumber();
            const savedReversal = await queryRunner.manager.save(reversalTransaction);
            await queryRunner.manager.update(bank_account_entity_1.BankAccount, { id: bankAccount.id }, {
                current_balance: newBalance.toNumber(),
                available_balance: newBalance.toNumber(),
                ledger_balance: newBalance.toNumber(),
            });
            await queryRunner.manager.update(bank_transaction_entity_1.BankTransaction, { id, tenant_id: tenantId }, { status: 'reversed' });
            await queryRunner.commitTransaction();
            await this.auditService.logAction(tenantId, userId, 'REVERSE', 'BankTransaction', id, { status: 'posted' }, { status: 'reversed', reversal_reason: reason });
            return savedReversal;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAccountStatement(accountId, startDate, endDate) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.bankAccountRepository.findOne({
            where: { id: accountId, tenant_id: tenantId },
        });
        if (!account) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        const transactions = await this.transactionRepository.find({
            where: {
                tenant_id: tenantId,
                bank_account_id: accountId,
                transaction_date: (0, typeorm_2.Between)(startDate, endDate),
                status: 'posted',
            },
            order: {
                transaction_date: 'ASC',
                created_at: 'ASC',
            },
        });
        const openingBalanceResult = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('SUM(CASE WHEN transaction_type = \'credit\' THEN amount ELSE -amount END)', 'balance')
            .where('tenant_id = :tenantId', { tenantId })
            .andWhere('bank_account_id = :accountId', { accountId })
            .andWhere('transaction_date < :startDate', { startDate })
            .andWhere('status = :status', { status: 'posted' })
            .getRawOne();
        const openingBalance = Number(openingBalanceResult?.balance || 0);
        let totalCredits = 0;
        let totalDebits = 0;
        transactions.forEach(transaction => {
            if (transaction.isCredit()) {
                totalCredits += Number(transaction.amount);
            }
            else {
                totalDebits += Number(transaction.amount);
            }
        });
        const closingBalance = openingBalance + totalCredits - totalDebits;
        return {
            account,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            transactions,
            total_credits: totalCredits,
            total_debits: totalDebits,
        };
    }
    async updateReconciliationStatus(transactionId, status, reconciledBy) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const transaction = await this.findOne(transactionId);
        const oldStatus = transaction.reconciliation_status;
        const updateData = {
            reconciliation_status: status,
            updated_by: userId,
        };
        if (status === 'reconciled') {
            updateData.reconciled_at = new Date();
            updateData.reconciled_by = reconciledBy || userId;
        }
        await this.transactionRepository.update({ id: transactionId, tenant_id: tenantId }, updateData);
        await this.auditService.logAction(tenantId, userId, 'RECONCILE', 'BankTransaction', transactionId, { reconciliation_status: oldStatus }, { reconciliation_status: status });
        return this.findOne(transactionId);
    }
    async validateDebitTransaction(account, amount) {
        const availableBalance = Number(account.available_balance || account.current_balance);
        const overdraftLimit = Number(account.overdraft_limit) || 0;
        const totalAvailable = availableBalance + overdraftLimit;
        if (amount > totalAvailable) {
            return {
                valid: false,
                message: `Insufficient funds. Available: ${totalAvailable}, Required: ${amount}`,
            };
        }
        const minimumBalance = Number(account.minimum_balance) || 0;
        const remainingBalance = availableBalance - amount;
        if (remainingBalance < minimumBalance && overdraftLimit === 0) {
            return {
                valid: false,
                message: `Transaction would breach minimum balance requirement of ${minimumBalance}`,
            };
        }
        return { valid: true };
    }
    async generateReferenceNumber(tenantId, prefix = 'TXN') {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const count = await this.transactionRepository.count({
            where: {
                tenant_id: tenantId,
                reference_number: new RegExp(`^${prefix}-${year}${month}`),
            },
        });
        const sequence = String(count + 1).padStart(6, '0');
        return `${prefix}-${year}${month}-${sequence}`;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bank_transaction_entity_1.BankTransaction)),
    __param(1, (0, typeorm_1.InjectRepository)(bank_account_entity_1.BankAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map