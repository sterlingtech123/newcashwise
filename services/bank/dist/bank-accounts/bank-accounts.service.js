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
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const decimal_js_1 = require("decimal.js");
const bank_account_entity_1 = require("./entities/bank-account.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let BankAccountsService = class BankAccountsService {
    constructor(bankAccountRepository, tenantService, auditService) {
        this.bankAccountRepository = bankAccountRepository;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createBankAccountDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const existingAccount = await this.bankAccountRepository.findOne({
            where: {
                account_number: createBankAccountDto.account_number,
                tenant_id: tenantId,
            },
        });
        if (existingAccount) {
            throw new common_1.BadRequestException(`Account number ${createBankAccountDto.account_number} already exists`);
        }
        if (createBankAccountDto.is_main_account) {
            await this.bankAccountRepository.update({ tenant_id: tenantId, is_main_account: true }, { is_main_account: false });
        }
        const bankAccount = this.bankAccountRepository.create({
            ...createBankAccountDto,
            tenant_id: tenantId,
            available_balance: createBankAccountDto.current_balance || 0,
            ledger_balance: createBankAccountDto.current_balance || 0,
            created_by: userId,
        });
        const savedAccount = await this.bankAccountRepository.save(bankAccount);
        await this.auditService.logAction(tenantId, userId, 'CREATE', 'BankAccount', savedAccount.id, null, savedAccount);
        return savedAccount;
    }
    async findAll(filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.bankAccountRepository
            .createQueryBuilder('account')
            .where('account.tenant_id = :tenantId', { tenantId })
            .orderBy('account.is_main_account', 'DESC')
            .addOrderBy('account.account_name', 'ASC');
        if (filters?.is_active !== undefined) {
            queryBuilder.andWhere('account.is_active = :is_active', {
                is_active: filters.is_active,
            });
        }
        if (filters?.account_type) {
            queryBuilder.andWhere('account.account_type = :account_type', {
                account_type: filters.account_type,
            });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.bankAccountRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['transactions'],
        });
        if (!account) {
            throw new common_1.NotFoundException(`Bank account with ID ${id} not found`);
        }
        return account;
    }
    async findByAccountNumber(accountNumber) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.bankAccountRepository.findOne({
            where: { account_number: accountNumber, tenant_id: tenantId },
        });
        if (!account) {
            throw new common_1.NotFoundException(`Bank account ${accountNumber} not found`);
        }
        return account;
    }
    async update(id, updateData) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const account = await this.findOne(id);
        if (updateData.account_number && updateData.account_number !== account.account_number) {
            const existingAccount = await this.bankAccountRepository.findOne({
                where: {
                    account_number: updateData.account_number,
                    tenant_id: tenantId,
                },
            });
            if (existingAccount) {
                throw new common_1.BadRequestException(`Account number ${updateData.account_number} already exists`);
            }
        }
        if (updateData.is_main_account && !account.is_main_account) {
            await this.bankAccountRepository.update({ tenant_id: tenantId, is_main_account: true }, { is_main_account: false });
        }
        const oldValues = { ...account };
        Object.assign(account, updateData);
        account.updated_by = userId;
        const updatedAccount = await this.bankAccountRepository.save(account);
        await this.auditService.logAction(tenantId, userId, 'UPDATE', 'BankAccount', id, oldValues, updatedAccount);
        return updatedAccount;
    }
    async updateBalance(accountId, newBalance, balanceType = 'current') {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const account = await this.findOne(accountId);
        const oldBalance = account[`${balanceType}_balance`];
        const updateData = {};
        updateData[`${balanceType}_balance`] = newBalance;
        updateData.updated_by = userId;
        await this.bankAccountRepository.update({ id: accountId, tenant_id: tenantId }, updateData);
        await this.auditService.logAction(tenantId, userId, 'BALANCE_UPDATE', 'BankAccount', accountId, { [`${balanceType}_balance`]: oldBalance }, { [`${balanceType}_balance`]: newBalance });
        return this.findOne(accountId);
    }
    async deactivate(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const account = await this.findOne(id);
        if (account.is_main_account) {
            throw new common_1.BadRequestException('Cannot deactivate the main account. Please set another account as main first.');
        }
        const oldValues = { is_active: account.is_active };
        account.is_active = false;
        account.updated_by = userId;
        const deactivatedAccount = await this.bankAccountRepository.save(account);
        await this.auditService.logAction(tenantId, userId, 'DEACTIVATE', 'BankAccount', id, oldValues, { is_active: false });
        return deactivatedAccount;
    }
    async getMainAccount() {
        const tenantId = this.tenantService.getCurrentTenantId();
        const mainAccount = await this.bankAccountRepository.findOne({
            where: {
                tenant_id: tenantId,
                is_main_account: true,
                is_active: true
            },
        });
        if (!mainAccount) {
            throw new common_1.NotFoundException('No main bank account found');
        }
        return mainAccount;
    }
    async getTotalBalance() {
        const tenantId = this.tenantService.getCurrentTenantId();
        const accounts = await this.bankAccountRepository.find({
            where: { tenant_id: tenantId, is_active: true },
        });
        let totalCurrentBalance = new decimal_js_1.Decimal(0);
        let totalAvailableBalance = new decimal_js_1.Decimal(0);
        const currencyBreakdown = {};
        accounts.forEach(account => {
            const currentBalance = new decimal_js_1.Decimal(account.current_balance || 0);
            const availableBalance = new decimal_js_1.Decimal(account.available_balance || 0);
            totalCurrentBalance = totalCurrentBalance.plus(currentBalance);
            totalAvailableBalance = totalAvailableBalance.plus(availableBalance);
            if (!currencyBreakdown[account.currency]) {
                currencyBreakdown[account.currency] = new decimal_js_1.Decimal(0);
            }
            currencyBreakdown[account.currency] = currencyBreakdown[account.currency].plus(currentBalance);
        });
        const currencyBreakdownNumbers = {};
        Object.keys(currencyBreakdown).forEach(currency => {
            currencyBreakdownNumbers[currency] = currencyBreakdown[currency].toNumber();
        });
        return {
            total_current_balance: totalCurrentBalance.toNumber(),
            total_available_balance: totalAvailableBalance.toNumber(),
            account_count: accounts.length,
            currency_breakdown: currencyBreakdownNumbers,
        };
    }
    async validateAccountForTransaction(accountId, amount, transactionType) {
        const account = await this.findOne(accountId);
        if (!account.is_active) {
            return { valid: false, message: 'Account is not active' };
        }
        if (transactionType === 'debit') {
            if (!account.canDebit(amount)) {
                return {
                    valid: false,
                    message: 'Insufficient funds including overdraft limit'
                };
            }
            const minimumBalance = Number(account.minimum_balance) || 0;
            const remainingBalance = account.getAvailableBalance() - amount;
            if (remainingBalance < minimumBalance) {
                return {
                    valid: false,
                    message: `Transaction would breach minimum balance requirement of ${minimumBalance}`
                };
            }
        }
        return { valid: true };
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bank_account_entity_1.BankAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map